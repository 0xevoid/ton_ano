# H Y D R A

Berikut ini adalah langkah-langkah untuk menyebarkan dan menempa token di lingkungan Node.js：

1. **Instal Lingkungan Node.js**

   Kunjungi Jaringan resmi Node.js https://nodejs.org/en <TAG1> dan unduh versi Node.js yang diinstal untuk sistem operasi Anda.


2. **Gudang klon**

 
   Buka alat baris perintah dan jalankan perintah berikut untuk mengkloning gudang：
   
   ```
   git clone https://github.com/0xevoid/ton_ano.git
   ```
   
3. **Instalasi tergantung**
 
   Masukkan katalog gudang yang dikloning dan kemudian jalankan perintah berikut untuk menginstal ketergantungan yang diperlukan：
   ```
   cd ton_ano
   ```
   ## Jalankan
   
   ```
   npm install @ton/ton @ton/crypto @ton/core buffer
   ```

4. **Konfigurasikan dan jalankan skrip**
 
   Buka file `index.js` dan atur Pharse **Wallet Baru** Anda.
   Setelah menyelesaikan konfigurasi, jalankan perintah berikut di baris perintah untuk menjalankan skrip：
   
   ```
   node index.js
   ```
