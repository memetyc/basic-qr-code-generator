import {QRCodeSVG} from 'qrcode.react';
import { useState } from 'react';

function App() {

  const [qrValue, setQrValue] = useState('');
  const downloadQR = () => {
    const svg = document.getElementById('qr');
  
    // SVG'yi serialize et
    const svgData = new XMLSerializer().serializeToString(svg);
  
  
    // Canvas ve Image nesneleri oluştur
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
  
    img.onload = () => {
      canvas.width = img.width * 4; // Daha yüksek çözünürlük için
      canvas.height = img.height * 4;
  
      // Beyaz arka plan (isteğe bağlı)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // QR'yi çiz
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      // PNG olarak indir
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-kod.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  
    // Base64'e çevir ve resmi yükle
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };


  return (
    <div className='min-h-screen container mx-auto px-1 p-10'>
      <h1 className="text-4xl font-bold text-center  text-blue-500">Qr Kod Oluşturucu</h1>
      <div className="flex justify-center items-center mt-10">

        <input value={qrValue} onChange={(e) => setQrValue(e.target.value)} className="border  border-black rounded-md md:w-1/2 w-full p-2" type="text" placeholder="Qr Kod İçeriği" />
  

      </div>
      {
        qrValue && (
          <div className='flex justify-center items-center mt-10 flex-col gap-5'>
            <QRCodeSVG id='qr' value={qrValue} size={256} />
            <button className='bg-black border cursor-pointer hover:bg-gray-800 duration-300 border-black rounded-md text-white px-4 py-2 ' onClick={downloadQR}>Qr Kodu İndir</button>
          </div>
        )
      }
      
      
    </div>
  )
}

export default App
