// Test pentru verificarea conexiunii Supabase după fix
import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection after fix...');
  
  try {
    // Test 1: Verifică accesul la profiles
    console.log('Testing profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (profilesError) {
      console.error('❌ Profiles test failed:', profilesError);
      return { success: false, error: 'Profiles table error: ' + profilesError.message };
    }
    console.log('✅ Profiles table: OK');
    
    // Test 2: Verifică accesul la listings
    console.log('Testing listings table...');
    const { data: listingsData, error: listingsError } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .limit(1);
    
    if (listingsError) {
      console.error('❌ Listings test failed:', listingsError);
      return { success: false, error: 'Listings table error: ' + listingsError.message };
    }
    console.log('✅ Listings table: OK');
    
    // Test 3: Verifică accesul la favorites
    console.log('Testing favorites table...');
    const { data: favoritesData, error: favoritesError } = await supabase
      .from('favorites')
      .select('count', { count: 'exact', head: true });
    
    if (favoritesError) {
      console.error('❌ Favorites test failed:', favoritesError);
      return { success: false, error: 'Favorites table error: ' + favoritesError.message };
    }
    console.log('✅ Favorites table: OK');
    
    // Test 4: Verifică autentificarea
    console.log('Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError);
      return { success: false, error: 'Auth error: ' + authError.message };
    }
    console.log('✅ Authentication: OK');
    
    console.log('🎉 All Supabase tests passed! The fix worked successfully.');
    return { 
      success: true, 
      message: 'Supabase connection fully restored!',
      details: {
        profiles: 'Working',
        listings: 'Working', 
        favorites: 'Working',
        auth: 'Working'
      }
    };
    
  } catch (error) {
    console.error('💥 Unexpected error during testing:', error);
    return { success: false, error: 'Unexpected error: ' + (error as Error).message };
  }
};