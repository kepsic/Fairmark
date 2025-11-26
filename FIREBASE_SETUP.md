# Firebase Setup Instructions

## Project Information
- **Project Name**: Fairmark
- **Project ID**: fairmark-ed88f
- **Project Number**: 448499570962

## Setup Steps

### 1. Firebase Console Configuration - Get Web App Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/fairmark-ed88f/settings/general)
2. Scroll down to **Your apps** section
3. If you don't have a web app yet:
   - Click **Add app** button
   - Select **Web** (</> icon)
   - Register app with nickname: "Fairmark Web"
   - Copy the `firebaseConfig` object values
4. If you already have a web app:
   - Click on the existing web app
   - Copy the config values from the Firebase SDK snippet

**Important**: The admin SDK credentials file (`fairmark-ed88f-firebase-adminsdk-fbsvc-fef2da4bb1.json`) is for server-side use only. For the client-side web app, you need the web app configuration (API Key and App ID).

### 2. Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Enable**

### 3. Configure Environment Variables

Update the `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-firebase-console
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fairmark-ed88f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fairmark-ed88f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fairmark-ed88f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=448499570962
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-from-firebase-console
```

### 4. Firestore Security Rules (Test Mode)

For development, use these rules (already set if you chose "test mode"):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 26);
    }
  }
}
```

### 5. Firestore Security Rules (Production)

Before deploying to production, update the rules to be more secure:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read: if true;
      allow write: if true; // Add proper authentication later
    }

    match /members/{memberId} {
      allow read: if true;
      allow write: if true; // Add proper authentication later
    }

    match /tasks/{taskId} {
      allow read: if true;
      allow write: if true; // Add proper authentication later
    }
  }
}
```

## Data Structure

### Collections

#### `groups`
- `id` (string): Unique group identifier
- `name` (string): Group name
- `description` (string): Group description
- `createdAt` (string): ISO timestamp

#### `members`
- `id` (string): Unique member identifier
- `groupId` (string): Reference to group
- `name` (string): Member name
- `email` (string): Member email
- `role` (string): 'member' | 'sherpa'
- `joinedAt` (string): ISO timestamp

#### `tasks`
- `id` (string): Unique task identifier
- `groupId` (string): Reference to group
- `title` (string): Task title
- `description` (string): Task description
- `assignedTo` (string | null): Member ID or null if unassigned
- `status` (string): 'todo' | 'in-progress' | 'done'
- `estimatedHours` (number): Estimated hours to complete
- `actualHours` (number): Actual hours spent
- `createdAt` (string): ISO timestamp
- `updatedAt` (string): ISO timestamp

## Development

After setup, run:

```bash
npm run dev
```

The app will connect to Firebase Firestore automatically.

## Migration from RxDB

The migration has been completed:
- ✅ Firebase SDK installed
- ✅ Firebase configuration created
- ✅ Firestore operations implemented
- ✅ GroupContext updated to use Firebase
- ✅ RxDB dependencies removed
- ✅ All existing functionality maintained

## Testing

Load the demo data using the "Load Demo Data" button in the app. This will create:
- 4 demo groups with members and tasks
- Including the "Disainmõtlemine" project with Estonian team
