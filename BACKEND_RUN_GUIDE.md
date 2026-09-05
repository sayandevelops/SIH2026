# 🛡️ ShieldScan — Backend Run & Setup Guide

এই ফাইলটিতে ShieldScan-এর **Python (FastAPI)** ব্যাকএন্ড কীভাবে খুব সহজে রান করবেন তার সম্পূর্ণ গাইড দেওয়া হলো।

---

## ⚡ সবচেয়ে দ্রুত রান করার নিয়ম (Quick Start)

আপনি যদি কোনো virtual environment activate করার ঝামেলায় না যেতে চান, সরাসরি নিচের কমান্ডটি দিয়ে এক ক্লিকে সার্ভার চালু করতে পারবেন:

### 🔹 PowerShell বা CMD-তে:
```powershell
# ১. ব্যাকএন্ড ফোল্ডারে যান
cd "c:\Users\SAYAN\Downloads\SIH PROJECT\shieldscan\backend"

# ২. সরাসরি .venv পাইথন দিয়ে সার্ভার রান করুন
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

### 🔹 Git Bash (MINGW64)-এ:
```bash
# ১. ব্যাকএন্ড ফোল্ডারে যান
cd "/c/Users/SAYAN/Downloads/SIH PROJECT/shieldscan/backend"

# ২. রান করুন
./.venv/Scripts/python -m uvicorn main:app --reload --port 8000
```

> 🟢 **সফলভাবে রান হলে টার্মিনালে দেখতে পাবেন:**  
> `INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)`  
> `INFO: Application startup complete.`

---

## 📋 স্ট্যান্ডার্ড নিয়ম (Virtual Environment Activate করে)

### ১. Windows PowerShell দিয়ে:
```powershell
# ১. ব্যাকএন্ড ফোল্ডারে ঢুকুন
cd "c:\Users\SAYAN\Downloads\SIH PROJECT\shieldscan\backend"

# ২. (যদি স্ক্রিপ্ট ব্লকের লাল এরর দেয়) Execution Policy বাইপাস করুন
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# ৩. ভার্চুয়াল এনভায়রনমেন্ট অ্যাক্টিভ করুন
.\.venv\Scripts\Activate.ps1

# ৪. সার্ভার চালু করুন
uvicorn main:app --reload --port 8000
```

### ২. Git Bash / MINGW64 টার্মিনাল দিয়ে:
```bash
cd "/c/Users/SAYAN/Downloads/SIH PROJECT/shieldscan/backend"

# Git Bash-এ source কমান্ড দিয়ে অ্যাক্টিভ করতে হয়
source .venv/Scripts/activate

# সার্ভার চালু করুন
uvicorn main:app --reload --port 8000
```

---

## 🔍 কীভাবে বুঝবেন ব্যাকএন্ড ঠিকমতো চলছে কিনা?

ব্রাউজার খুলে নিচের লিঙ্কগুলোতে ভিজিট করুন:

| ফিচার | URL লিঙ্ক | কী দেখাবে? |
| :--- | :--- | :--- |
| **Health Check** | [http://localhost:8000/](http://localhost:8000/) | `{"system": "ShieldScan", "status": "operational"}` |
| **Swagger API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | সবকটি API এন্ডপয়েন্ট লাইভ টেস্ট করার ড্যাশবোর্ড |
| **Developer Keys API** | [http://localhost:8000/api/v1/keys/list](http://localhost:8000/api/v1/keys/list) | অ্যাক্টিভ ডেভেলপার কী তালিকা |

---

## 🛠️ নতুন কম্পিউটারে প্রথমবার সেটআপের নিয়ম (First Time Setup on a New PC)

যদি কখনো প্রোজেক্টটি সম্পূর্ণ নতুন কোনো পিসিতে ক্লোন বা কপি করেন:

```powershell
# ১. ব্যাকএন্ড ফোল্ডারে যান
cd backend

# ২. নতুন পাইথন ভার্চুয়াল এনভায়রনমেন্ট তৈরি করুন
python -m venv .venv

# ৩. লাইব্রেরিগুলো ইন্সটল করুন (FastAPI, OpenCV, EasyOCR, PyMuPDF ইত্যাদি)
.\.venv\Scripts\pip.exe install -r requirements.txt

# ৪. টেস্ট ওয়াচলিস্ট ডাটাবেস জেনারেট করুন
.\.venv\Scripts\python.exe utils/generate_test_data.py

# ৫. সার্ভার চালু করুন
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

---

## ⚠️ কমন সমস্যা ও সমাধান (Troubleshooting)

### সমস্যা ১: `Port 8000 is already in use` (পোর্ট ৮০০০ অন্য প্রসেসে আটকে আছে)
**সমাধান:** হয় পোর্ট ৮০০০-এর আগের প্রসেসটি বন্ধ করুন, অথবা পোর্ট ৮০০১-এ চালান:
```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8001
```

### সমস্যা ২: `Activate.ps1 cannot be loaded because running scripts is disabled`
**সমাধান:** PowerShell-এ এই কমান্ডটি চালিয়ে আবার অ্যাক্টিভ করুন:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### সমস্যা ৩: `bash: ..venvScriptsActivate.ps1: command not found`
**কারণ:** Git Bash-এ উইন্ডোজের `.ps1` ফাইল চলে না।  
**সমাধান:** Git Bash-এ লিখুন:  
```bash
source .venv/Scripts/activate
```
অথবা সরাসরি চালান:  
```bash
./.venv/Scripts/python -m uvicorn main:app --reload --port 8000
```

---

## 🛑 সার্ভার বন্ধ করার নিয়ম
টার্মিনালে গিয়ে কিবোর্ডে **`Ctrl + C`** চাপলে সার্ভার বন্ধ হয়ে যাবে।
