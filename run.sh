#!/bin/bash

# Tentukan apakah itu ada node_modules Direktori, jika ada, jangan instal dependensi
if [ ! -d "./node_modules" ]; then
  echo "**********"
  echo "Mulai menginstal dependensi"
  npm install @ton/ton @ton/crypto @ton/core buffer
  echo "Instalasi ketergantungan selesai"
  echo "**********"
fi
nohup node index.js >> mint.log 2>&1 &
pid=$!

# ctrl + c Saat keluar, matikan proses anak dan jangan ganggu tugas latar belakang
echo "Jika Anda ingin menutup tugas, lakukan ./kill.sh"
echo "#!/bin/bash" > kill.sh
echo "kill $pid" >> kill.sh
echio "rm kill.sh" >> kill.sh
chmod +x kill.sh
echo "****************"
echo "Keluaran log terbaru dari program saat ini："
tail -n 10 mint.log
echo "****************"
echo "Program telah mulai dijalankan. Untuk melihat keluaran log, silakan jalankan perintah berikut："
echo "tail -f mint.log"
