import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://deurppvykakyvwvixihn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldXJwcHZ5a2FreXZ3dml4aWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMTE2ODIsImV4cCI6MjA1MjU4NzY4Mn0.6XFmcGOLFPDrFJY932mUPyoDuqupy8e5sxJbfJ9ryeM"

export const supabase = createClient(supabaseUrl, supabaseKey)


export const signUp = async (email, password, name, role) => {
  try {
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password
      },
      {
        data: {
          name, // Storing name in user metadata
          role  // Storing role in user metadata
        }
      }
    )

    if (error) {
      console.error('Error signing up:', error.message)
    } else {
      console.log('User signed up successfully:', data)
      return data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}



export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { error };
  }

  console.log('User logged in:', data);
  return { data };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
  } else {
    console.log('User logged out');
  }
}

// Example for handling authentication state changes
// supabase.auth.onAuthStateChange((event, session) => {
//   if (event === 'SIGNED_IN') {
//     console.log('User signed in:', session.user);
//   } else if (event === 'SIGNED_OUT') {
//     console.log('User signed out');
//   }
// });
