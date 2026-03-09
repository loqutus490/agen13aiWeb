import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async (userId: string | undefined) => {
      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
        }

        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminStatus(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoading(true);
        checkAdminStatus(session?.user?.id);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, loading };
};
