# 📍 CityCares Locator

## 🏠 Discover All Support Networks
A platform that consolidates all resources for people in unstable housing situations in NYC. Users can explore organizations, shelters, and food banks through an interactive **map** and **searchable list**.

Project Screenshot ![citycaresscrenshot](https://github.com/user-attachments/assets/cfad9ad2-4458-4af6-89e4-bfaa270b9d4f)

---

## 🚀 Features
- **Interactive Map:** Locate nonprofits, shelters, and food banks in NYC.
- **Search & Filter:** Find resources based on specific needs (e.g., food, shelter, LGBTQ+ support).
- **Organization Details:** View phone numbers, websites, descriptions, and addresses.
- **Click on Map Markers:** Open a **modal with details** on selected organizations.
- **Geolocation:** Find **organizations near you**.
- **User Contributions:** Suggest new nonprofits (Upcoming Feature).
- **Mobile-Friendly UI** for seamless accessibility.

---

## 🎥 Demo
[Live Demo](https://citycares.netlify.app/)

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, React-Leaflet (for maps)
- **Backend:** Supabase (for authentication & database management)
- **State Management:** Context API, Custom Hooks
- **Styling:** CSS Modules
- **Tools:** ESLint, Vite, GitHub Actions (for CI/CD)

---

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/CityCaresLocator.git
cd CityCaresLocator
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Run the App**
```sh
npm run dev
```

### **4️⃣ Run the Mock Server (if needed)**
```sh
npm run server
```
- The data is served from `data/enterprise.json` on `http://localhost:9000`

---

## 🗺️ Project Structure
```
CityCaresLocator/
│── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # Context API for state management
│   ├── hooks/             # Custom hooks (Geolocation, API calls)
│   ├── pages/             # Page-level components
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   ├── index.css          # Global styles
│── public/                # Static assets
│── data/                  # JSON data storage
│── package.json           # Dependencies & scripts
│── vite.config.js         # Vite configuration
```

---

## 🛠️ Contribution Guidelines

Want to help? Contributions are welcome! 🚀

1. **Fork the repo**
2. **Create a new branch**: `git checkout -b feature-name`
3. **Commit your changes**: `git commit -m "Added feature X"`
4. **Push to GitHub**: `git push origin feature-name`
5. **Open a Pull Request**

---

## 📝 Upcoming Features
- ✅ Click on map markers to open an organization modal
- ⏳ "Suggest an Organization" feature for user contributions
- ⏳ Admin dashboard for managing nonprofits
- ⏳ Rating & review system for organizations
- ⏳ Advanced filtering with multiple category selection

---


## 🌟 Acknowledgments
This project is built to support people in unstable housing situations. Inspired by the need for accessible nonprofit information.

---

## 🏆 Show Your Support
Give this project a ⭐ on [GitHub](https://github.com/YOUR_GITHUB_USERNAME/CityCaresLocator) if you find it useful!

---

## 📬 Contact
- **Email:** [sultanmalik.dev@gmail.com]

---

## 📜 License
This project is open-source and available under the **MIT License**.
