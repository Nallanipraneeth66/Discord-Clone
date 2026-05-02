<div align="center">

#  Discord Clone — Full-Stack Real-Time Communication Platform

A feature-rich, real-time communication platform inspired by Discord, built with the **MERN stack**, **Socket.IO**, and **LiveKit WebRTC**.  
Supports instant messaging, voice/video calls, server management, and more.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io)](https://socket.io/)
[![LiveKit](https://img.shields.io/badge/LiveKit-WebRTC-7C3AED?logo=webrtc)](https://livekit.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

##  Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [WebSocket Events](#-websocket-events)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Team Members](#-team-members)
- [License](#-license)

---

##  Overview

This project is a **full-stack Discord clone** developed as an academic group project. It replicates the core functionality of Discord — including real-time messaging, voice/video communication, server (channel) management, friend system, and online presence tracking — using modern web technologies.

The application follows a **three-tier microservice architecture**:

| Tier | Technology | Port |
|------|-----------|------|
| **Frontend** | React 19 + Vite 6 + Tailwind CSS | `5173` |
| **Backend API** | Node.js + Express.js | `5000` |
| **Real-Time Server** | Socket.IO | `3001` |
| **Database** | MongoDB (Mongoose ODM) | `27017` |
| **Voice/Video** | LiveKit Cloud (WebRTC) | Cloud |

---

##  Key Features

###  Messaging
- **Private Direct Messages (DMs)** — One-on-one real-time conversations
- **Channel Chat Rooms** — Group messaging within server text channels
- **Image Sharing** — Upload and share images in chats via Multer
- **Real-Time Delivery** — Instant message delivery via WebSocket

###  Voice & Video
- **Voice Channels** — Join voice rooms within servers for live audio
- **Video Calling** — Peer-to-peer video conferencing powered by LiveKit
- **Screen Sharing** — Share your screen during voice/video sessions
- **Dynamic Join/Leave** — Real-time user presence in voice rooms

###  Server (Channel) Management
- **Create Servers** — Users can create their own community servers
- **Text & Voice Rooms** — Create multiple chat and voice rooms per server
- **Invite System** — Generate invite codes to add members
- **Role Management** — Admin controls with member kick functionality
- **Server Settings** — Customizable server name, icon, and configuration

###  Social Features
- **Friend System** — Send, accept, and decline friend requests
- **Online Presence** — Real-time online/offline status indicators
- **User Profiles** — Customizable profile with avatar and bio
- **Notifications** — Real-time friend request and message notifications

###  Authentication & Security
- **JWT Authentication** — Secure token-based login/signup
- **Bcrypt Hashing** — Encrypted password storage
- **Cookie-Based Sessions** — Persistent sessions via HTTP-only cookies
- **Protected Routes** — Middleware-guarded API endpoints

---

##  System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │   Chat   │ │ Channel  │ │ Voice/Video  │  │
│  │  Module  │ │  Module  │ │  Mgmt    │ │   (LiveKit)  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │
│       │             │            │               │          │
└───────┼─────────────┼────────────┼───────────────┼──────────┘
        │ HTTP/REST   │ HTTP/REST  │ HTTP/REST     │ WebRTC
        ▼             ▼            ▼               ▼
┌───────────────────────────────────┐  ┌──────────────────┐
│   BACKEND API (Express.js:5000)   │  │  SOCKET SERVER   │
│  ┌─────────┐┌─────────┐┌───────┐ │  │  (Socket.IO:3001)│
│  │  User   ││ Channel ││ Msg   │ │  │                  │
│  │ Service ││ Service ││Service│ │  │  WebSocket Event │
│  └────┬────┘└────┬────┘└───┬───┘ │  │     Handler      │
│       │          │         │     │  └──────────────────┘
│  ┌────┴────┐┌────┴────┐   │     │
│  │Auth MW  ││Multer MW│   │     │  ┌──────────────────┐
│  └─────────┘└─────────┘   │     │  │  LiveKit Cloud   │
└───────────┬───────────────┬┘     │  │  (WebRTC SFU)    │
            │               │      │  └──────────────────┘
            ▼               ▼      │
┌────────────────────────────────────────────────────────────┐
│                  MongoDB (Port 27017)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Users   │ │ Channels │ │ Messages │ │ ChannelMsgs  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI component library |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React Router DOM 7** | Client-side routing |
| **Axios** | HTTP client for REST APIs |
| **Socket.IO Client** | WebSocket client |
| **LiveKit Components React** | Voice/video UI components |
| **React Icons** | Icon library |
| **React Toastify** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js 4** | Web framework & REST API |
| **Mongoose 8** | MongoDB ODM |
| **JSON Web Tokens** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Multer** | File upload handling |
| **LiveKit Server SDK** | WebRTC token generation |
| **Cookie Parser** | Session cookie handling |

### Real-Time & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Socket.IO 4** | Bidirectional WebSocket server |
| **MongoDB** | NoSQL document database |
| **LiveKit Cloud** | WebRTC media server (SFU) |

---

##  Project Structure

```
Discord-main/
├── backend/                    # REST API Server (Port 5000)
│   ├── controller/
│   │   ├── UserController.js       # Auth, friends, profile logic
│   │   ├── ChannelController.js    # Server & room management
│   │   └── MessageController.js    # DM & channel messaging
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── model/
│   │   ├── User.js                 # User schema
│   │   ├── Channel.js              # Channel/server schema
│   │   ├── Message.js              # Direct message schema
│   │   └── ChannelMessage.js       # Channel message schema
│   ├── router/
│   │   ├── UserRouter.js           # /api/auth/* routes
│   │   ├── ChannelRouter.js        # /api/channel/* routes
│   │   └── MessageRouter.js        # /api/message/* routes
│   ├── uploads/                    # Uploaded images storage
│   ├── .env.example                # Environment variables template
│   ├── index.js                    # Express server entry point
│   └── package.json
│
├── frontend/                   # React Client (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx             # Server list sidebar
│   │   │   ├── Menu.jsx                # Navigation menu
│   │   │   ├── ChatArea.jsx            # Message display area
│   │   │   ├── PrivateChat.jsx         # DM chat interface
│   │   │   ├── ChannelMenu.jsx         # Server channel list
│   │   │   ├── VideoConferenceRoom.jsx # LiveKit video room
│   │   │   ├── VoiceComponent.jsx      # Voice channel component
│   │   │   └── ... (26 components)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Main dashboard
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx          # Registration page
│   │   │   ├── Channel.jsx         # Server/channel view
│   │   │   ├── FriendChat.jsx      # DM conversation page
│   │   │   └── Profile.jsx         # User profile page
│   │   ├── context/
│   │   │   └── UserContext.jsx     # Global state management
│   │   ├── App.jsx                 # Root component & routing
│   │   ├── main.jsx                # Application entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── socket/                     # Real-Time Server (Port 3001)
│   ├── index.js                    # Socket.IO event handlers
│   └── package.json
│
└── README.md                   # This file
```

---

##  Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB** (local) or a **MongoDB Atlas** connection string — [Download](https://www.mongodb.com/try/download/community)
- **Git** — [Download](https://git-scm.com/)
- **LiveKit Cloud Account** (for voice/video) — [Sign Up](https://livekit.io/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/Discord-Clone-Fullstack.git
cd Discord-Clone-Fullstack/Discord-main
```

**2. Install dependencies for all three services**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Socket Server
cd ../socket
npm install
```

**3. Configure environment variables**

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your credentials (see [Environment Variables](#-environment-variables)).

**4. Start MongoDB**

```bash
# If using local MongoDB
mongod
```

**5. Start all three servers** (in separate terminals)

```bash
# Terminal 1 — Backend API
cd backend
npm run dev

# Terminal 2 — Socket Server
cd socket
npm run dev

# Terminal 3 — Frontend
cd frontend
npm run dev
```

**6. Open the application**

Navigate to **http://localhost:5173** in your browser.

---

##  Environment Variables

Create a `.env` file in the `backend/` directory using the template below:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend API server port | `5000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/discord_clone` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-here` |
| `LIVEKIT_API_KEY` | LiveKit Cloud API key | `APIxxxxxxxx` |
| `LIVEKIT_SECRET_KEY` | LiveKit Cloud secret key | `xxxxxxxxxxxxxxxx` |
| `NODE_ENV` | Environment mode | `development` |

---

##  API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate and receive JWT |
| `GET` | `/logout` | Clear session cookies |
| `GET` | `/profile` | Get authenticated user profile |
| `PUT` | `/update-profile` | Update user profile & avatar |
| `POST` | `/send-friend-request` | Send a friend request |
| `POST` | `/accept-friend-request` | Accept a pending request |
| `POST` | `/decline-friend-request` | Decline a pending request |
| `GET` | `/friends` | Get friends list |
| `GET` | `/pending-requests` | Get pending friend requests |

### Channel Management (`/api/channel`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create` | Create a new server |
| `POST` | `/join` | Join a server via invite code |
| `POST` | `/create-room` | Create a text chat room |
| `POST` | `/create-voice-room` | Create a voice room |
| `GET` | `/get-channels` | Get user's server list |
| `GET` | `/get-channel/:id` | Get server details |
| `PUT` | `/update-settings` | Update server settings |
| `DELETE` | `/kick-member` | Remove a member from server |
| `DELETE` | `/leave` | Leave a server |

### Messaging (`/api/message`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/send` | Send a direct message |
| `GET` | `/get/:receiverId` | Get DM conversation |
| `POST` | `/channel/send` | Send a channel message |
| `GET` | `/channel/get` | Get channel chat history |

### LiveKit Token

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getToken` | Generate a LiveKit room access token |

---

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `userOnline` | `userId` | Register user as online |
| `send_message` | `{newMessage, profilePic}` | Send a DM |
| `sendMessageToChat` | `{channelId, chatName, message, ...}` | Send a channel message |
| `friendRequest` | `senderId, receiverId, ...` | Notify friend request |
| `sendAcceptOrDecNotificationToUser` | `senderId, receiverId, ...` | Accept/decline notification |
| `joinServer` | `{channelId, channelUsers, userData}` | Notify server join |
| `sendVoiceJoinedUser` | `{channelId, roomName, ...}` | User joined voice |
| `sendVoiceLeftUser` | `{channelId, roomName, ...}` | User left voice |
| `userKickedFromChannel` | `{channelId, kickUserId}` | Kick a user |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `receive_message` | `message` | Receive a DM |
| `messageNotification` | `{senderId, profilePic}` | New message alert |
| `sendMessageToChatArea` | `{channelId, message, ...}` | Channel message received |
| `friendRequestNotification` | `senderId, username, ...` | Friend request alert |
| `onlineFriends` | `[{_id, username, profilePic}]` | Online friends list |
| `userJoinedVoiceRoom` | `{channelId, roomName, ...}` | Voice join notification |
| `kickedFromChannel` | `{channelId}` | Kicked notification |

---

## 🗄 Database Schema

### Users Collection

```javascript
{
  username:       String,        // Unique username
  email:          String,        // Unique email address
  password:       String,        // Bcrypt hashed password
  profilePic:     String,        // Avatar image URL
  bio:            String,        // User bio/description
  friends:        [ObjectId],    // References to User documents
  channels:       [ObjectId],    // References to Channel documents
  notifications:  [Object],      // Friend request notifications
  friendRequests: [ObjectId]     // Pending incoming requests
}
```

### Channels Collection

```javascript
{
  channelName:  String,          // Server display name
  channelPic:   String,          // Server icon URL
  admin:        ObjectId,        // Creator/owner reference
  inviteCode:   String,          // Unique invite code
  users:        [ObjectId],      // Member references
  chatRooms:    [String],        // Text channel names
  voiceRooms:   [String]         // Voice channel names
}
```

### Messages Collection

```javascript
{
  senderId:    ObjectId,         // Message sender
  receiverId:  ObjectId,         // Message recipient
  message:     String,           // Message content
  time:        String,           // Timestamp
  isImage:     Boolean           // Whether message is an image
}
```

### Channel Messages Collection

```javascript
{
  channelId:  ObjectId,          // Parent channel reference
  chatName:   String,            // Room name within channel
  senderId:   ObjectId,          // Message sender
  username:   String,            // Sender's display name
  profilePic: String,            // Sender's avatar
  message:    String,            // Message content
  time:       String,            // Timestamp
  isImage:    Boolean            // Whether message is an image
}
```

---

##  Screenshots

> _Screenshots of the application can be found in the project report._

---

##  Team Members

| # | Name | Role |
|---|------|------|
| 1 | Team Member 1 | Full-Stack Development |
| 2 | Team Member 2 | Full-Stack Development |
| 3 | Team Member 3 | Full-Stack Development |
| 4 | Team Member 4 | Full-Stack Development |

> **Group:** Group-1

---

##  License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- [Discord](https://discord.com/) — UI/UX inspiration
- [LiveKit](https://livekit.io/) — WebRTC infrastructure
- [Socket.IO](https://socket.io/) — Real-time communication engine
- [MongoDB](https://www.mongodb.com/) — Database platform

---

<div align="center">

** If you found this project helpful, give it a star!**

Made with ❤️ by Group-1

</div>
