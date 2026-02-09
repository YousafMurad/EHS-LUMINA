-- =====================================================
-- EHS ERP - Row Level Security Policies
-- Description: Security policies for data access control
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTION: Get current user's role
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM public.profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('super_admin', 'admin') 
        FROM public.profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Only super_admin can insert profiles (via admin functions)
CREATE POLICY "Super admin can insert profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (public.get_user_role() = 'super_admin');

-- =====================================================
-- SESSIONS POLICIES
-- =====================================================
-- Everyone can view sessions
CREATE POLICY "Anyone can view sessions"
ON public.sessions FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage sessions
CREATE POLICY "Admins can insert sessions"
ON public.sessions FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update sessions"
ON public.sessions FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete sessions"
ON public.sessions FOR DELETE
TO authenticated
USING (public.is_admin());

-- =====================================================
-- CLASSES POLICIES
-- =====================================================
CREATE POLICY "Anyone can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage classes"
ON public.classes FOR ALL
TO authenticated
USING (public.is_admin());

-- =====================================================
-- SECTIONS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view sections"
ON public.sections FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage sections"
ON public.sections FOR ALL
TO authenticated
USING (public.is_admin());

-- =====================================================
-- TEACHERS POLICIES
-- =====================================================
CREATE POLICY "Staff can view teachers"
ON public.teachers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage teachers"
ON public.teachers FOR ALL
TO authenticated
USING (public.is_admin());

-- =====================================================
-- STUDENTS POLICIES
-- =====================================================
CREATE POLICY "Staff can view students"
ON public.students FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can insert students"
ON public.students FOR INSERT
TO authenticated
WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'operator'));

CREATE POLICY "Staff can update students"
ON public.students FOR UPDATE
TO authenticated
USING (public.get_user_role() IN ('super_admin', 'admin', 'operator'));

CREATE POLICY "Admins can delete students"
ON public.students FOR DELETE
TO authenticated
USING (public.is_admin());

-- =====================================================
-- FEE STRUCTURES POLICIES
-- =====================================================
CREATE POLICY "Staff can view fee structures"
ON public.fee_structures FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage fee structures"
ON public.fee_structures FOR ALL
TO authenticated
USING (public.is_admin());

-- =====================================================
-- STUDENT FEES POLICIES
-- =====================================================
CREATE POLICY "Staff can view student fees"
ON public.student_fees FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage student fees"
ON public.student_fees FOR ALL
TO authenticated
USING (public.get_user_role() IN ('super_admin', 'admin', 'operator', 'accountant'));

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================
CREATE POLICY "Staff can view payments"
ON public.payments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can insert payments"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'operator', 'accountant'));

-- Only admins can update/delete payments (for corrections)
CREATE POLICY "Admins can update payments"
ON public.payments FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete payments"
ON public.payments FOR DELETE
TO authenticated
USING (public.is_admin());

-- =====================================================
-- PROMOTIONS POLICIES
-- =====================================================
CREATE POLICY "Staff can view promotions"
ON public.promotions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage promotions"
ON public.promotions FOR ALL
TO authenticated
USING (public.is_admin());

-- =====================================================
-- ACTIVITY LOGS POLICIES
-- =====================================================
-- Only admins can view logs
CREATE POLICY "Admins can view activity logs"
ON public.activity_logs FOR SELECT
TO authenticated
USING (public.is_admin());

-- System can insert logs (via service role)
CREATE POLICY "System can insert logs"
ON public.activity_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Row Level Security Policies Created Successfully!';
END $$;
