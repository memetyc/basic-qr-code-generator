import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import SunMoon from './components/SunMoon';

function App() {
  const [qrValue, setQrValue] = useState('https://www.helloworldyazilim.com/');
  const qrCodeRef = useRef(null);
  const [dotsColor, setDotsColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [logo, setLogo] = useState(null);
  const [dotShape, setDotShape] = useState('rounded');
  const [theme, setTheme] = useState(null)

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    try {
        const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") || "light";
        
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
        localStorage.setItem("theme", savedTheme);
    } catch (error) {
        console.error("Theme setting error:", error);
        setTheme("light");
        document.documentElement.setAttribute("data-theme", "light");
    } 
}, []);

const handleThemeChange = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        return newTheme;
    });
}; 


  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      margin: 10,
      type: 'svg',
      data: qrValue,
      dotsOptions: {
        color: dotsColor,
        type: dotShape,
      },
      image: logo,
      backgroundOptions: {
        color: backgroundColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5
    }
    });

    if (qrCodeRef.current) {
      qrCodeRef.current.innerHTML = '';
      qrCode.append(qrCodeRef.current);
    }

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = '';
      }
    };
  }, [qrValue, dotsColor, backgroundColor, dotShape, logo]);

  // PNG indirme fonksiyonu
  const downloadPNG = () => {
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) {
      console.error("QR kodu render edilmedi.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 4; // Daha yüksek çözünürlük için
      canvas.height = img.height * 4;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // SVG indirme fonksiyonu
  const downloadSVG = () => {
    const svgElement = qrCodeRef.current.querySelector('svg'); // SVG elementini alıyoruz
    if (!svgElement) {
      console.error("QR kodu SVG formatında render edilmedi.");
      return;
    }

    // SVG'nin geçici bir kopyasını oluşturuyoruz
    const svgCopy = svgElement.cloneNode(true);

    // Mevcut viewBox değerini alıyoruz
    const originalViewBox = svgElement.getAttribute('viewBox');

    // Kopya SVG'nin boyutlarını ayarlıyoruz
    svgCopy.setAttribute('width', '100vw');  // Ekran genişliğine ayarla
    svgCopy.setAttribute('height', '100vh'); // Ekran yüksekliğine ayarla
    svgCopy.setAttribute('viewBox', originalViewBox); // Orijinal viewBox değerini kullanıyoruz

    // SVG'yi string'e çeviriyoruz
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgCopy);
    const blob = new Blob([svgString], { type: 'image/svg+xml' }); // Blob oluşturuyoruz
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'qr-code.svg'; // Dosya adı
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url); // Belleği temizliyoruz
  };
  return (
    <div className='bg-base-100 '>
        <SunMoon theme={theme} handleThemeChange={handleThemeChange}/>
      <div className='min-h-screen container mx-auto px-1 p-10 '>
      <h1 className="text-4xl font-bold text-center text-base-content">Qr Kod Oluşturucu</h1>
      <div className="flex justify-center items-center mt-10">
        <input
          value={qrValue}
          onChange={(e) => setQrValue(e.target.value)}
          className="border border-black rounded-md md:w-1/2 w-full p-2"
          type="text"
          placeholder="Qr Kod İçeriği"
        />
      </div>


      <div className='flex md:flex-row flex-col justify-center mt-10 gap-5 '>
        <div className='flex flex-col gap-5 shadow-md p-5 rounded-md'>
          <div className='flex items-center justify-start gap-3 '>
            <label htmlFor="dotColor" className="text-lg font-bold">Renk</label>
            <input type="color" name="dotColor" id="dotColor" value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} className="w-10 h-10  rounded-md cursor-pointer" />
            <input type="text" className='w-20 h-10 border rounded-md p-1' value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} />
          </div>
          <div className='divide-base-300 border-t'></div>
          <div className='flex items-center gap-3 '>
            <label htmlFor="backgroundColor" className="text-lg font-bold">Arkaplan Rengi</label>
            <input type="color" name="backgroundColor" id="backgroundColor" onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10  rounded-md cursor-pointer" />
            <input type="text" className='w-25 h-10 border rounded-md p-1' value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
          </div>
          <div className='divide-base-300 border-t'></div>
          <div className='flex items-center gap-3 '>
            <label htmlFor="dotShape" className="text-lg font-bold">Nokta Şekli</label>
            <div className="flex gap-2">
              <div className='w-10 h-10 cursor-pointer hover:bg-gray-200 duration-300 rounded-md' onClick={() => setDotShape('square')}>
                <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h1v1h-1v-1zM1 4h1v1h-1v-1zM1 1h4v1h-1v1h-1v-1h-1v1h-1v-2zM4 3h1v2h-2v-1h1v-1z" fill="#000"></path></svg>
              </div>
              <div className='w-10 h-10 cursor-pointer hover:bg-gray-200 duration-300 rounded-md' onClick={() => setDotShape('rounded')}>
                <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 3a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM1.5 4a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM1.5 1h3a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 0 -0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 0 -0.5 -0.5a0.5 0.5 0 0 0 -0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5v-1a0.5 0.5 0 0 1 0.5 -0.5zM4.5 3a0.5 0.5 0 0 1 0.5 0.5v1a0.5 0.5 0 0 1 -0.5 0.5h-1a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5a0.5 0.5 0 0 0 0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5z" fill="#000"></path></svg>
              </div>
              <div className='w-10 h-10 cursor-pointer hover:bg-gray-200 duration-300 rounded-md' onClick={() => setDotShape('dots')}>
                <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 3a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM1.5 4a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM1.5 1a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM2.5 1a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM3.5 1a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM4.5 1a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM1.5 2a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM3.5 2a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM4.5 3a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM3.5 4a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5zM4.5 4a0.5 0.5 0 0 1 0.5 0.5a0.5 0.5 0 0 1 -0.5 0.5a0.5 0.5 0 0 1 -0.5 -0.5a0.5 0.5 0 0 1 0.5 -0.5z" fill="#000"></path></svg>
              </div>
              <div className='w-10 h-10 cursor-pointer hover:bg-gray-200 duration-300 rounded-md' onClick={() => setDotShape('classy')}>
                <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M2 3L3.0469826841899113 3.03447518830396L2.9939804029762653 3.9426757574140447L1.9318072885283302 3.9521981961383474L1.9687606376590023 3.052713339385909zM1 4L2.0241520047626236 4.064487040105503L2.0322412419795253 4.949602568158695L0.9441990441150028 4.968037494438718L1.0651825416717597 3.9531699228394634zM1 1L2.0019418109729616 0.9546037840957771L2.9517363661628853 0.9504771792983996L3.9698606378025656 1.0600724697718735L4.931225194931601 1.05448943508998L4.9492609882444425 1.9616116088775972L3.96916257025635 2.0411422217409787L3.9872294140128557 3.006195402180867L3.056339674054803 2.9928856182391224L2.95580760003338 1.990436434177885L2.047679846341573 1.9767122006633842L1.9655405831502475 3.01422587637055L0.9451074051927344 3.064812218609644L1.0087406874069669 2.0449061346589152L1.0110902738948773 0.9325540304195853zM4 3L5.032894514921538 3.059923968375625L5.016637663881592 3.9900027418416006L5.023173193974967 5.058840365469847L4.031142134713541 5.0662634993234015L3.00040044310987 5.020321459812262L2.9770736074666835 4.02244246963991L4.035587897349888 3.9688399076642655L3.9319516134271173 2.9781685627476167z" fill="#000"></path></svg>
              </div>
              <div className='w-10 h-10 cursor-pointer hover:bg-gray-200 duration-300 rounded-md' onClick={() => setDotShape('classy-rounded')}>
                <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M2 3L3.0469826841899113 3.03447518830396L2.9939804029762653 3.9426757574140447L1.9318072885283302 3.9521981961383474L1.9687606376590023 3.052713339385909zM1 4L2.0241520047626236 4.064487040105503L2.0322412419795253 4.949602568158695L0.9441990441150028 4.968037494438718L1.0651825416717597 3.9531699228394634zM1 1L2.0019418109729616 0.9546037840957771L2.9517363661628853 0.9504771792983996L3.9698606378025656 1.0600724697718735L4.931225194931601 1.05448943508998L4.9492609882444425 1.9616116088775972L3.96916257025635 2.0411422217409787L3.9872294140128557 3.006195402180867L3.056339674054803 2.9928856182391224L2.95580760003338 1.990436434177885L2.047679846341573 1.9767122006633842L1.9655405831502475 3.01422587637055L0.9451074051927344 3.064812218609644L1.0087406874069669 2.0449061346589152L1.0110902738948773 0.9325540304195853zM4 3L5.032894514921538 3.059923968375625L5.016637663881592 3.9900027418416006L5.023173193974967 5.058840365469847L4.031142134713541 5.0662634993234015L3.00040044310987 5.020321459812262L2.9770736074666835 4.02244246963991L4.035587897349888 3.9688399076642655L3.9319516134271173 2.9781685627476167z" fill="#000"></path></svg>
              </div>
              <div className='w-10 h-10 cursor-pointer hover:bg-gray-200 duration-300 rounded-md' onClick={() => setDotShape('extra-rounded')}>
                <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M2 3L3.0469826841899113 3.03447518830396L2.9939804029762653 3.9426757574140447L1.9318072885283302 3.9521981961383474L1.9687606376590023 3.052713339385909zM1 4L2.0241520047626236 4.064487040105503L2.0322412419795253 4.949602568158695L0.9441990441150028 4.968037494438718L1.0651825416717597 3.9531699228394634zM1 1L2.0019418109729616 0.9546037840957771L2.9517363661628853 0.9504771792983996L3.9698606378025656 1.0600724697718735L4.931225194931601 1.05448943508998L4.9492609882444425 1.9616116088775972L3.96916257025635 2.0411422217409787L3.9872294140128557 3.006195402180867L3.056339674054803 2.9928856182391224L2.95580760003338 1.990436434177885L2.047679846341573 1.9767122006633842L1.9655405831502475 3.01422587637055L0.9451074051927344 3.064812218609644L1.0087406874069669 2.0449061346589152L1.0110902738948773 0.9325540304195853zM4 3L5.032894514921538 3.059923968375625L5.016637663881592 3.9900027418416006L5.023173193974967 5.058840365469847L4.031142134713541 5.0662634993234015L3.00040044310987 5.020321459812262L2.9770736074666835 4.02244246963991L4.035587897349888 3.9688399076642655L3.9319516134271173 2.9781685627476167z" fill="#000"></path></svg>
              </div>
            </div>
          </div>
          <div className='divide-base-300 border-t'></div>
          <div className='flex items-center gap-3 '>
            <label htmlFor="logo" className="text-lg font-bold">Logo</label>
            <input type="file" name="logo" id="logo" onChange={handleLogoChange} className="border rounded-md p-2" accept="image/*" />
          </div>
        </div>

        <div className='flex justify-center items-center  flex-col gap-5 shadow-md p-5 rounded-md'>
          {/* QR kodunu render etme */}
          <div
            ref={qrCodeRef}
            style={{ width: '300px', height: '300px' }} // Boyutlandırma yap
          />
      
        </div>
        
      </div>
      <div className="flex gap-5 justify-center mt-10">
            <button
              className='btn'
              onClick={downloadSVG}
            >
              SVG Olarak İndir
            </button>
            <button
              className='btn'
              onClick={downloadPNG}
            >
              PNG Olarak İndir
            </button>
          </div>
    </div>
    </div>
  );
}

export default App;