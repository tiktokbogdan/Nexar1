import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';

// Credențialele Supabase pentru proiectul tău
const supabaseUrl = 'https://tidnmzsivsthwwcfdzyo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZG5tenNpdnN0aHd3Y2ZkenlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjE5NTgsImV4cCI6MjA2NjI5Nzk1OH0.Sr1gSZ2qtoff7gmulkT8uIzB8eL7gqKUUNVj82OqHog'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipuri pentru baza de date
export interface Listing {
  id: string
  title: string
  price: number
  year: number
  mileage: number
  location: string
  category: string
  brand: string
  model: string
  engine_capacity: number
  fuel_type: string
  transmission: string
  condition: string
  description: string
  images: string[]
  seller_id: string
  seller_name: string
  seller_type: 'individual' | 'dealer'
  rating: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  avatar_url?: string
  verified: boolean
  created_at: string
}

// Lista orașelor din România
export const romanianCities = [
  'București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați',
  'Ploiești', 'Oradea', 'Bacău', 'Pitești', 'Arad', 'Sibiu', 'Târgu Mureș', 'Baia Mare',
  'Buzău', 'Botoșani', 'Satu Mare', 'Râmnicu Vâlcea', 'Drobeta-Turnu Severin', 'Suceava',
  'Piatra Neamț', 'Târgu Jiu', 'Tulcea', 'Focșani', 'Bistrița', 'Reșița', 'Alba Iulia',
  'Deva', 'Hunedoara', 'Slatina', 'Vaslui', 'Călărași', 'Giurgiu', 'Slobozia', 'Zalău',
  'Turda', 'Mediaș', 'Onești', 'Gheorgheni', 'Pașcani', 'Dej', 'Reghin', 'Roman',
  'Câmpina', 'Caracal', 'Făgăraș', 'Lugoj', 'Mangalia', 'Moreni', 'Oltenița', 'Petroșani',
  'Râmnicu Sărat', 'Roșiorii de Vede', 'Săcele', 'Sebeș', 'Sfântu Gheorghe', 'Tecuci',
  'Toplița', 'Voluntari', 'Pantelimon', 'Popești-Leordeni', 'Chiajna', 'Otopeni',
  'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6',
  'Bragadiru', 'Buftea', 'Chitila', 'Corbeanca', 'Domnești', 'Măgurele', 'Mogoșoaia',
  'Cernica', 'Glina', 'Jilava', 'Peris', 'Snagov', 'Stefanestii de Jos', 'Tunari',
  'Florești', 'Apahida', 'Baciu', 'Feleacu', 'Gilău', 'Jucu', 'Kolozsvar',
  'Dumbrăvița', 'Ghiroda', 'Giroc', 'Moșnița Nouă', 'Pișchia', 'Remetea Mare',
  'Rediu', 'Miroslava', 'Popricani', 'Tomești', 'Valea Lupului', 'Ciurea',
  'Mamaia', 'Eforie Nord', 'Eforie Sud', 'Neptun', 'Olimp', 'Costinești',
  'Predeal', 'Sinaia', 'Bușteni', 'Azuga', 'Câmpulung', 'Mioveni',
  'Drobeta Turnu Severin', 'Băilești', 'Calafat', 'Filiași', 'Motru', 'Segarcea'
];

// Funcție pentru a crea profilul manual dacă nu există
const ensureProfileExists = async (user: any, userData?: any) => {
  try {
    console.log('🔍 Checking if profile exists for user:', user.email)
    
    // Verificăm dacă profilul există deja
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (existingProfile && !checkError) {
      console.log('✅ Profile already exists for user:', user.email)
      return existingProfile
    }
    
    console.log('❌ Profile not found, creating new profile for:', user.email)
    
    // Dacă nu există, îl creăm
    const profileData = {
      user_id: user.id,
      name: userData?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Utilizator',
      email: user.email,
      phone: userData?.phone || user.user_metadata?.phone || '',
      location: userData?.location || user.user_metadata?.location || '',
      seller_type: userData?.sellerType || user.user_metadata?.sellerType || 'individual',
      verified: false,
      rating: 0,
      reviews_count: 0
    }
    
    console.log('📝 Creating profile with data:', profileData)
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Error creating profile:', createError)
      throw createError
    }
    
    console.log('✅ Profile created successfully:', newProfile)
    return newProfile
  } catch (err) {
    console.error('💥 Error in ensureProfileExists:', err)
    throw err
  }
}

// Funcții pentru autentificare
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    try {
      console.log('🚀 Starting signup process for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      })
      
      if (error) {
        console.error('❌ Signup error:', error)
        return { data, error }
      }
      
      if (data.user) {
        console.log('👤 User created, ensuring profile exists...')
        try {
          await ensureProfileExists(data.user, userData)
        } catch (profileError) {
          console.error('⚠️ Profile creation failed during signup:', profileError)
          // Nu returnăm eroare aici pentru că utilizatorul a fost creat cu succes
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('💥 SignUp error:', err)
      return { data: null, error: err }
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      console.log('🔐 Starting signin process for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Signin error:', error)
        return { data, error }
      }
      
      if (data.user) {
        console.log('✅ User signed in successfully:', data.user.email)
        
        try {
          // Asigurăm că profilul există
          const profile = await ensureProfileExists(data.user)
          
          if (profile) {
            // Salvăm datele utilizatorului în localStorage pentru acces rapid
            const userData = {
              id: data.user.id,
              name: profile.name,
              email: profile.email,
              sellerType: profile.seller_type,
              isLoggedIn: true
            }
            
            localStorage.setItem('user', JSON.stringify(userData))
            console.log('💾 User data saved to localStorage:', userData)
          }
        } catch (profileError) {
          console.error('⚠️ Profile handling failed during signin:', profileError)
          // Salvăm măcar datele de bază
          const userData = {
            id: data.user.id,
            name: data.user.email?.split('@')[0] || 'Utilizator',
            email: data.user.email,
            sellerType: 'individual',
            isLoggedIn: true
          }
          localStorage.setItem('user', JSON.stringify(userData))
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('💥 SignIn error:', err)
      return { data: null, error: err }
    }
  },

  signOut: async () => {
    console.log('👋 Signing out user...')
    localStorage.removeItem('user')
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        console.error('❌ Error updating password:', error)
        return { data: null, error }
      }
      
      console.log('✅ Password updated successfully')
      return { data, error: null }
    } catch (err) {
      console.error('💥 Error updating password:', err)
      return { data: null, error: err }
    }
  }
}

// Funcții pentru anunțuri
export const listings = {
  getAll: async (filters?: any) => {
    try {
      console.log('🔍 Fetching all listings from Supabase...')
      
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (filters) {
        if (filters.category) query = query.eq('category', filters.category.toLowerCase())
        if (filters.brand) query = query.eq('brand', filters.brand)
        if (filters.priceMin) query = query.gte('price', filters.priceMin)
        if (filters.priceMax) query = query.lte('price', filters.priceMax)
        if (filters.yearMin) query = query.gte('year', filters.yearMin)
        if (filters.yearMax) query = query.lte('year', filters.yearMax)
        if (filters.location) query = query.ilike('location', `%${filters.location}%`)
        if (filters.sellerType) query = query.eq('seller_type', filters.sellerType)
        if (filters.condition) query = query.eq('condition', filters.condition)
        if (filters.fuel) query = query.eq('fuel_type', filters.fuel)
        if (filters.transmission) query = query.eq('transmission', filters.transmission)
        if (filters.engineMin) query = query.gte('engine_capacity', filters.engineMin)
        if (filters.engineMax) query = query.lte('engine_capacity', filters.engineMax)
        if (filters.mileageMax) query = query.lte('mileage', filters.mileageMax)
      }

      const { data, error } = await query
      
      if (error) {
        console.error('❌ Error fetching listings:', error)
        return { data: null, error }
      }
      
      console.log(`✅ Successfully fetched ${data?.length || 0} listings`)
      return { data, error: null }
    } catch (err) {
      console.error('💥 Error in listings.getAll:', err)
      return { data: null, error: err }
    }
  },

  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()
      
      // Incrementăm numărul de vizualizări
      if (data && !error) {
        await supabase
          .from('listings')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', id)
      }
      
      return { data, error }
    } catch (err) {
      console.error('Error fetching listing:', err)
      return { data: null, error: err }
    }
  },

  create: async (listing: Partial<Listing>, images: File[]) => {
    try {
      console.log('🚀 Starting listing creation process...')
      
      // 1. Obținem utilizatorul curent
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Utilizatorul nu este autentificat')
      }
      
      console.log('👤 Current user:', user.email)
      
      // 2. Obținem profilul utilizatorului pentru a avea seller_id corect
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, seller_type')
        .eq('user_id', user.id)
        .single()
      
      if (profileError || !profile) {
        console.error('❌ Profile not found:', profileError)
        throw new Error('Profilul utilizatorului nu a fost găsit. Te rugăm să-ți completezi profilul mai întâi.')
      }
      
      console.log('✅ Profile found:', profile)
      
      // 3. Verificăm dacă bucket-ul există, dacă nu îl creăm
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('❌ Error checking buckets:', bucketsError)
      }
      
      const listingImagesBucket = buckets?.find(bucket => bucket.name === 'listing-images')
      
      if (!listingImagesBucket) {
        console.log('📦 Creating listing-images bucket...')
        const { error: createBucketError } = await supabase.storage.createBucket('listing-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        })
        
        if (createBucketError) {
          console.error('❌ Error creating bucket:', createBucketError)
          // Continuăm fără să aruncăm eroare, poate bucket-ul există deja
        } else {
          console.log('✅ Bucket created successfully')
        }
      }
      
      // 4. Încărcăm imaginile în storage (dacă există)
      const imageUrls: string[] = []
      
      if (images && images.length > 0) {
        console.log(`📸 Uploading ${images.length} images...`)
        
        for (const image of images) {
          const fileExt = image.name.split('.').pop()
          const fileName = `${uuidv4()}.${fileExt}`
          const filePath = `${profile.id}/${fileName}`
          
          console.log(`📤 Uploading image: ${fileName}`)
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('listing-images')
            .upload(filePath, image, {
              cacheControl: '3600',
              upsert: false
            })
          
          if (uploadError) {
            console.error('❌ Error uploading image:', uploadError)
            // Continuăm cu următoarea imagine în loc să oprim procesul
            continue
          }
          
          console.log('✅ Image uploaded:', uploadData.path)
          
          // Obținem URL-ul public pentru imagine
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath)
          
          console.log('🔗 Public URL:', publicUrl)
          imageUrls.push(publicUrl)
        }
        
        console.log(`✅ Uploaded ${imageUrls.length} images successfully`)
      }
      
      // 5. Pregătim datele pentru anunț cu seller_id corect
      const listingData = {
        ...listing,
        id: uuidv4(),
        seller_id: profile.id, // Folosim ID-ul din profiles, nu din auth.users
        seller_name: profile.name,
        seller_type: profile.seller_type,
        images: imageUrls,
        status: 'active',
        views_count: 0,
        favorites_count: 0,
        rating: 0,
        featured: false
      }
      
      console.log('📝 Creating listing with data:', {
        ...listingData,
        images: `${imageUrls.length} images`
      })
      
      // 6. Creăm anunțul în baza de date
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating listing:', error)
        throw new Error(`Eroare la crearea anunțului: ${error.message}`)
      }
      
      console.log('✅ Listing created successfully:', data.id)
      return { data, error: null }
      
    } catch (err: any) {
      console.error('💥 Error in listings.create:', err)
      return { data: null, error: err }
    }
  },

  update: async (id: string, updates: Partial<Listing>, newImages?: File[]) => {
    try {
      // Dacă avem imagini noi, le încărcăm
      if (newImages && newImages.length > 0) {
        const imageUrls: string[] = []
        
        // Obținem anunțul curent pentru a păstra imaginile existente
        const { data: currentListing } = await supabase
          .from('listings')
          .select('images, seller_id')
          .eq('id', id)
          .single()
        
        // Păstrăm imaginile existente
        if (currentListing && currentListing.images) {
          imageUrls.push(...currentListing.images)
        }
        
        // Adăugăm imaginile noi
        for (const image of newImages) {
          const fileExt = image.name.split('.').pop()
          const fileName = `${uuidv4()}.${fileExt}`
          const filePath = `${currentListing?.seller_id}/${fileName}`
          
          const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(filePath, image)
          
          if (uploadError) {
            console.error('Error uploading image:', uploadError)
            continue
          }
          
          // Obținem URL-ul public pentru imagine
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath)
          
          imageUrls.push(publicUrl)
        }
        
        // Actualizăm anunțul cu noile imagini
        updates.images = imageUrls
      }
      
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
      
      return { data, error }
    } catch (err) {
      console.error('Error updating listing:', err)
      return { data: null, error: err }
    }
  },

  delete: async (id: string) => {
    try {
      // Obținem anunțul pentru a șterge imaginile
      const { data: listing } = await supabase
        .from('listings')
        .select('images')
        .eq('id', id)
        .single()
      
      // Ștergem imaginile din storage
      if (listing && listing.images) {
        for (const imageUrl of listing.images) {
          // Extragem path-ul din URL
          const urlParts = imageUrl.split('/')
          const fileName = urlParts[urlParts.length - 1]
          const sellerFolder = urlParts[urlParts.length - 2]
          const filePath = `${sellerFolder}/${fileName}`
          
          await supabase.storage
            .from('listing-images')
            .remove([filePath])
        }
      }
      
      // Ștergem anunțul
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
      
      return { error }
    } catch (err) {
      console.error('Error deleting listing:', err)
      return { error: err }
    }
  },
  
  addToFavorites: async (userId: string, listingId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, listing_id: listingId }])
        .select()
      
      return { data, error }
    } catch (err) {
      console.error('Error adding to favorites:', err)
      return { data: null, error: err }
    }
  },
  
  removeFromFavorites: async (userId: string, listingId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, listing_id: listingId })
      
      return { error }
    } catch (err) {
      console.error('Error removing from favorites:', err)
      return { error: err }
    }
  },
  
  getFavorites: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', userId)
      
      return { data, error }
    } catch (err) {
      console.error('Error fetching favorites:', err)
      return { data: null, error: err }
    }
  },

  checkIfFavorite: async (userId: string, listingId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('listing_id', listingId)
      
      if (error) {
        console.error('Error checking if favorite:', error)
        return { isFavorite: false, error }
      }
      
      // Check if data array has any items (favorite exists)
      const isFavorite = data && data.length > 0
      
      return { isFavorite, error: null }
    } catch (err) {
      console.error('Error checking if favorite:', err)
      return { isFavorite: false, error: err }
    }
  }
}

// Funcții pentru profiluri
export const profiles = {
  getById: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      return { data, error }
    } catch (err) {
      console.error('Error fetching profile:', err)
      return { data: null, error: err }
    }
  },
  
  update: async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
      
      return { data, error }
    } catch (err) {
      console.error('Error updating profile:', err)
      return { data: null, error: err }
    }
  },
  
  uploadAvatar: async (userId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${userId}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file)
      
      if (uploadError) {
        return { error: uploadError }
      }
      
      // Obținem URL-ul public pentru avatar
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)
      
      // Actualizăm profilul cu noul avatar
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId)
        .select()
      
      return { data, error }
    } catch (err) {
      console.error('Error uploading avatar:', err)
      return { data: null, error: err }
    }
  }
}

// Funcții pentru mesaje
export const messages = {
  send: async (senderId: string, receiverId: string, listingId: string, content: string, subject?: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: senderId,
          receiver_id: receiverId,
          listing_id: listingId,
          content,
          subject,
          id: uuidv4()
        }])
        .select()
      
      return { data, error }
    } catch (err) {
      console.error('Error sending message:', err)
      return { data: null, error: err }
    }
  },
  
  getConversations: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
      
      return { data, error }
    } catch (err) {
      console.error('Error fetching conversations:', err)
      return { data: null, error: err }
    }
  },
  
  markAsRead: async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .select()
      
      return { data, error }
    } catch (err) {
      console.error('Error marking message as read:', err)
      return { data: null, error: err }
    }
  }
}

// Funcții pentru recenzii
export const reviews = {
  create: async (reviewerId: string, reviewedId: string, listingId: string, rating: number, comment?: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          reviewer_id: reviewerId,
          reviewed_id: reviewedId,
          listing_id: listingId,
          rating,
          comment,
          id: uuidv4()
        }])
        .select()
      
      // Actualizăm rating-ul mediu pentru utilizatorul evaluat
      if (!error) {
        // Obținem toate recenziile pentru utilizator
        const { data: userReviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('reviewed_id', reviewedId)
        
        if (userReviews) {
          // Calculăm media
          const avgRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
          
          // Actualizăm profilul
          await supabase
            .from('profiles')
            .update({ 
              rating: parseFloat(avgRating.toFixed(2)),
              reviews_count: userReviews.length
            })
            .eq('user_id', reviewedId)
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('Error creating review:', err)
      return { data: null, error: err }
    }
  },
  
  getForUser: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed_id', userId)
        .order('created_at', { ascending: false })
      
      return { data, error }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      return { data: null, error: err }
    }
  }
}

// Funcție pentru a verifica dacă utilizatorul este autentificat
export const isAuthenticated = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch (err) {
    console.error('Error checking authentication:', err)
    return false
  }
}

// Funcție pentru a verifica dacă Supabase este configurat corect
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    return !error
  } catch (e) {
    console.error('Supabase connection error:', e)
    return false
  }
}

// Funcție pentru testarea conexiunii complete
export const testConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Conexiunea de bază
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    
    if (healthError) {
      console.error('❌ Health check failed:', healthError)
      return { success: false, error: 'Database connection failed' }
    }
    
    console.log('✅ Database connection successful')
    
    // Test 2: Verificăm tabelele
    const tables = ['profiles', 'listings', 'favorites', 'messages', 'reviews']
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        console.error(`❌ Table ${table} not found:`, error)
        return { success: false, error: `Table ${table} missing` }
      }
      console.log(`✅ Table ${table} exists`)
    }
    
    // Test 3: Verificăm storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Storage check failed:', bucketsError)
      return { success: false, error: 'Storage not accessible' }
    }
    
    const requiredBuckets = ['listing-images', 'profile-images']
    const existingBuckets = buckets?.map(b => b.name) || []
    
    for (const bucket of requiredBuckets) {
      if (!existingBuckets.includes(bucket)) {
        console.warn(`⚠️ Bucket ${bucket} not found`)
        
        // Creăm bucket-ul dacă nu există
        console.log(`📦 Creating ${bucket} bucket...`)
        const { error: createBucketError } = await supabase.storage.createBucket(bucket, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        })
        
        if (createBucketError) {
          console.error(`❌ Error creating ${bucket} bucket:`, createBucketError)
        } else {
          console.log(`✅ Bucket ${bucket} created successfully`)
        }
      } else {
        console.log(`✅ Bucket ${bucket} exists`)
      }
    }
    
    console.log('🎉 All tests passed! Supabase is ready to use.')
    return { success: true, message: 'All systems operational' }
    
  } catch (err) {
    console.error('❌ Connection test failed:', err)
    return { success: false, error: 'Unexpected error during testing' }
  }
}

// Funcție pentru a crea profilul manual pentru utilizatorul existent
export const createMissingProfile = async (userId: string, email: string) => {
  try {
    console.log('🔧 Creating missing profile for user:', email)
    
    const profileData = {
      user_id: userId,
      name: email.split('@')[0], // Folosim partea din email ca nume implicit
      email: email,
      phone: '',
      location: '',
      seller_type: 'individual',
      verified: false,
      rating: 0,
      reviews_count: 0
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating missing profile:', error)
      throw error
    }
    
    console.log('✅ Missing profile created successfully:', data)
    return { data, error: null }
  } catch (err) {
    console.error('💥 Error in createMissingProfile:', err)
    return { data: null, error: err }
  }
}

// Funcție pentru a repara utilizatorul curent
export const fixCurrentUserProfile = async () => {
  try {
    console.log('🔧 Starting profile repair process...')
    
    // Obținem utilizatorul curent
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ No authenticated user found:', userError)
      return { success: false, error: 'No authenticated user' }
    }
    
    console.log('👤 Found authenticated user:', user.email)
    
    // Verificăm dacă profilul există
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (existingProfile && !profileError) {
      console.log('✅ Profile already exists, updating localStorage...')
      
      // Actualizăm localStorage cu datele corecte
      const userData = {
        id: user.id,
        name: existingProfile.name,
        email: existingProfile.email,
        sellerType: existingProfile.seller_type,
        isLoggedIn: true
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, message: 'Profile found and localStorage updated' }
    }
    
    // Profilul nu există, îl creăm
    console.log('❌ Profile not found, creating new profile...')
    
    const result = await createMissingProfile(user.id, user.email!)
    
    if (result.error) {
      console.error('❌ Failed to create profile:', result.error)
      return { success: false, error: 'Failed to create profile' }
    }
    
    // Actualizăm localStorage cu datele noi
    const userData = {
      id: user.id,
      name: result.data!.name,
      email: result.data!.email,
      sellerType: result.data!.seller_type,
      isLoggedIn: true
    }
    
    localStorage.setItem('user', JSON.stringify(userData))
    
    console.log('🎉 Profile repair completed successfully!')
    return { success: true, message: 'Profile created and localStorage updated' }
    
  } catch (err) {
    console.error('💥 Error in fixCurrentUserProfile:', err)
    return { success: false, error: 'Unexpected error during repair' }
  }
}