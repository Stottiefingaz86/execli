# Database Migration Instructions

## Step 1: Run the Migration in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Copy the entire contents of `user-auth-migration.sql` file
4. Paste it into the SQL Editor
5. Click **Run** to execute the migration

## Step 2: Verify the Migration

After running the migration, you can verify it worked by checking:

1. **Tables Created**: Look for these new tables in the **Table Editor**:
   - `user_accounts`
   - `user_sessions` 
   - `user_plans`
   - `user_activity`

2. **Functions Created**: Check the **Functions** section for:
   - `create_partial_account`
   - `upgrade_to_full_account`
   - `link_reports_to_user`
   - `create_default_user_plan`

3. **Columns Added**: The existing tables should have new columns:
   - `companies` table: `user_id`, `created_via`
   - `voc_reports` table: `user_id`, `created_via`

## Step 3: Test the System

Once the migration is complete, you can test:

1. **Create a free report** - Should create a partial account
2. **Sign up with the same email** - Should upgrade to full account
3. **Login** - Should see the user avatar in navigation
4. **Create reports from dropdown** - Should work for authenticated users

## Troubleshooting

If you encounter any issues:

1. **Check the SQL Editor logs** for any error messages
2. **Verify environment variables** are set correctly
3. **Restart the development server** after migration
4. **Clear browser cookies** if testing authentication

## Migration SQL Content

The migration file contains:
- User authentication tables
- Session management
- User plans and subscriptions
- Activity logging
- Helper functions for account management
- Indexes for performance
- Triggers for automatic actions 