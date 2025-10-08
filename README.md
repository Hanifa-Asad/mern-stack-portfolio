# Portfolio V5

Hello everyone! 👋

I’m **Hanifa Asad**, a passionate **MERN Stack Developer**. This is my personal portfolio website project built to showcase my work and skills.

---

## 🚀 Live Demo

**Website:** [https://your-portfolio-link-here.com](https://your-portfolio-link-here.com)

---

## 🛠️ Tech Stack

* **ReactJS**
* **Tailwind CSS**
* **Supabase**
* **AOS (Animate On Scroll)**
* **Framer Motion**
* **Material UI**
* **SweetAlert2**

---

## 🏃‍♀️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Hanifa-Asad/your-portfolio-repo-name.git
cd your-portfolio-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Then open `http://localhost:5173`.

---

## ⚙️ Supabase Configuration

### 1. Create a Project

Go to [Supabase](https://supabase.com/) and create a new project.
Copy your **Project URL** and **anon public key** from **Settings → API**.

### 2. Add Environment Variables

Create a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabase Setup File

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 📞 Contact

**Hanifa Asad**

* GitHub: [Hanifa-Asad](https://github.com/Hanifa-Asad)
* Portfolio: [https://your-portfolio-link-here.com](https://your-portfolio-link-here.com)

---

⭐ If you like this project, please give it a star on GitHub!
