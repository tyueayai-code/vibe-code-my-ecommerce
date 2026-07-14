'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateQR, uploadVideo, createOrder } from '@/lib/api';
import DrawingCanvas from '@/components/DrawingCanvas';
import { Heart, Video, Image as ImageIcon, Package, CheckCircle, Palette } from 'lucide-react';

export default function CustomizePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [customization, setCustomization] = useState({
    packaging: {
      paper_type: 'Standard',
      ribbon_color: 'Pink',
      gift_wrap: false,
    },
    greeting_card: {
      text: '',
      drawing_data: '',
    },
    video_url: '',
    qr_code: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const data = await uploadVideo(file.name, token!);
      setCustomization(prev => ({ ...prev, video_url: data.url }));
      
      // Generate QR code for the video URL
      setLoadingQR(true);
      const qrData = await generateQR(data.url);
      setCustomization(prev => ({ ...prev, qr_code: qrData.qrCode }));
    } catch (err) {
      alert('Video upload failed');
    } finally {
      setUploading(false);
      setLoadingQR(false);
    }
  };

  const handleDrawingSave = (dataUrl: string) => {
    setCustomization(prev => ({
      ...prev,
      greeting_card: { ...prev.greeting_card, drawing_data: dataUrl }
    }));
  };

  const handleFinish = async () => {
    setLoadingQR(true);
    try {
      const token = localStorage.getItem('token');
      const recipient = JSON.parse(localStorage.getItem('checkout_recipient') || '{}');
      const cart = JSON.parse(localStorage.getItem('vibe_cart') || '[]');
      const finalPrice = cart.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0) + 60;

      const orderData = {
        recipient_user_id: 'guest',
        delivery_address: recipient.address,
        total_amount: finalPrice,
        packaging: customization.packaging,
        video_url: customization.video_url,
        greeting_card: customization.greeting_card,
        products: cart,
      };

      await createOrder(orderData, token!);
      
      localStorage.removeItem('checkout_recipient');
      localStorage.removeItem('vibe_cart');
      
      // Success effect
      // In a real app, use a valid sound file URL
      // const audio = new Audio('/success.mp3');
      // audio.play();
      
      setIsFinished(true);
    } catch (err) {
      alert('Order placement failed. Please try again.');
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-pink-200 text-center space-y-6 animate-in zoom-in-50 duration-700 max-w-md">
            <div className="text-9xl animate-bounce">🎉</div>
            <h2 className="text-4xl font-extrabold text-gray-900">Surprise Locked!</h2>
            <p className="text-xl text-gray-600">Your luxury gift is prepared with love.</p>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 active:scale-95 transition-all"
            >
              Back Home
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">Make it <span className="text-pink-600">Special</span></h1>
          <p className="text-gray-500">Add a personal touch to your surprise</p>
          
          <div className="flex justify-center items-center gap-4 mt-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === s ? 'bg-pink-600 text-white ring-4 ring-pink-100' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 text-pink-600 font-bold text-xl">
                <Package className="w-6 h-6" /> 1. Packaging Options
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Wrapping Paper</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Standard', 'Premium Glossy', 'Matte Pastel', 'Floral Pattern'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setCustomization(prev => ({ ...prev, packaging: { ...prev.packaging, paper_type: type } }))}
                        className={`p-3 text-sm rounded-xl border transition-all ${
                          customization.packaging.paper_type === type 
                            ? 'border-pink-500 bg-pink-50 text-pink-600 font-bold' 
                            : 'border-gray-200 hover:border-pink-300 text-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Ribbon Color</label>
                  <div className="flex gap-3">
                    {['Pink', 'Red', 'Gold', 'Blue', 'White'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setCustomization(prev => ({ ...prev, packaging: { ...prev.packaging, ribbon_color: color } }))}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          customization.packaging.ribbon_color === color ? 'border-pink-600 scale-125' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() === 'gold' ? '#ffd700' : color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <input
                  type="checkbox"
                  id="giftwrap"
                  checked={customization.packaging.gift_wrap}
                  onChange={(e) => setCustomization(prev => ({ ...prev, packaging: { ...prev.packaging, gift_wrap: e.target.checked } }))}
                  className="w-5 h-5 accent-pink-600"
                />
                <label htmlFor="giftwrap" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Add extra premium gift wrapping (฿50)
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 text-pink-600 font-bold text-xl">
                <Heart className="w-6 h-6" /> 2. Greeting Card
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all h-32"
                    placeholder="Write something sweet..."
                    value={customization.greeting_card.text}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      greeting_card: { ...prev.greeting_card, text: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Your Special Drawing</label>
                  {customization.greeting_card.drawing_data ? (
                    <div className="relative p-4 bg-white border-2 border-pink-100 rounded-3xl shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300">
                      <img src={customization.greeting_card.drawing_data} alt="Your Drawing" className="w-full rounded-2xl border border-pink-50" />
                      <button 
                        onClick={() => setCustomization(prev => ({ ...prev, greeting_card: { ...prev.greeting_card, drawing_data: '' } }))}
                        className="absolute top-6 right-6 px-4 py-2 bg-pink-500 text-white font-bold rounded-xl shadow-md hover:bg-pink-600 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <DrawingCanvas onSave={handleDrawingSave} />
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 text-pink-600 font-bold text-xl">
                <Video className="w-6 h-6" /> 3. Video Surprise
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-full max-w-sm p-8 border-2 border-dashed border-gray-300 rounded-3xl hover:border-pink-500 transition-all bg-gray-50 group cursor-pointer relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Upload Video Message</p>
                      <p className="text-xs text-gray-500">MP4, MOV up to 20MB</p>
                    </div>
                  </div>
                </div>

                {uploading && (
                  <div className="flex items-center gap-2 text-pink-600 font-medium">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-600 border-t-transparent"></div>
                    Uploading your love...
                  </div>
                )}

                {customization.qr_code && (
                  <div className="mt-6 space-y-4 animate-in zoom-in duration-500">
                    <p className="text-sm font-medium text-gray-600">We'll attach this QR code to your gift!</p>
                    <div className="p-4 bg-white rounded-2xl shadow-lg inline-block">
                      <img src={customization.qr_code} alt="Video QR Code" className="w-40 h-40" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
            <button
              disabled={step === 1}
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-2 text-gray-500 font-bold hover:text-gray-800 disabled:opacity-30 transition-colors"
            >
              Back
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-200 transition-all active:scale-95"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" /> Finish Customization
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
