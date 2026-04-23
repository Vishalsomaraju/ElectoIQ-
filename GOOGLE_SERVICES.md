# Google Services Integration

ElectoIQ leverages multiple Google Cloud and Firebase services for its core architecture, adhering to production-grade security and performance patterns.

## 1. Firebase Authentication
- **Implementation**: Google Sign-In via `firebase/auth` using `signInWithPopup`.
- **Security**: Utilizes explicitly scoped parameters (`email`, `profile`) to enforce principle of least privilege.
- **Role**: Serves as the primary identity provider.

## 2. Cloud Firestore
- **Implementation**: Used for real-time synchronization of users, timeline events, and glossary terms.
- **Security**: Implements strict `firestore.rules` featuring role-based access control (RBAC), user ownership checks (`isOwner`), and a secure `deny-all` catch-all.
- **Performance**: Pre-configured with `firestore.indexes.json` to enable optimized compound querying.

## 3. Firebase Hosting
- **Implementation**: Deployed via Firebase Hosting for high-speed global CDN delivery.
- **Security**: Configuration (`firebase.json`) integrates production-grade security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`) and rigorous caching rules.

## 4. Gemini 1.5 Flash (Google AI Studio)
- **Implementation**: Provides the generative AI capability for the conversational ElectoBot assistant and the dynamic quiz engine.
- **Usage**: Invoked asynchronously through a custom React hook leveraging `@google/genai`.
