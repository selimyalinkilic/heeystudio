# Supabase Integration Setup

## Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-setup.sql` file
4. This will create:
   - `portfolios` table with proper structure
   - RLS (Row Level Security) policies
   - Sample data for testing
   - Indexes for better performance

## Database Schema

### portfolios table

- `id` (bigserial, primary key)
- `title` (varchar, required) - Portfolio item title
- `description` (text, optional) - Portfolio item description
- `image_url` (varchar, required) - URL to portfolio image
- `category` (varchar, optional) - Portfolio category
- `created_at` (timestamp, auto-generated)
- `updated_at` (timestamp, auto-updated)

## Features

### Hero Section

- Displays the latest 3 portfolio items from Supabase
- Falls back to static images if no data is available
- Shows portfolio title and description as overlay

### Masonry Gallery

- Displays all portfolio items from Supabase
- Falls back to static images if no data is available
- Opens portfolio details in a modal when clicked
- Shows portfolio info on hover

## Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the following:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Project API Key - anon public (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Project API Key - service_role (SUPABASE_SERVICE_ROLE_KEY)

## API Functions

The following functions are available in `lib/api.ts`:

- `getLatestPortfolios()` - Gets latest 3 portfolios for hero section
- `getAllPortfolios()` - Gets all portfolios for masonry gallery
- `getPortfolioById(id)` - Gets a specific portfolio by ID

## Development

After setting up Supabase and adding your credentials to `.env.local`, the application will automatically fetch data from your Supabase database. If there's no data or connection issues, it will fall back to static images.
