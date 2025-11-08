import React from 'react';

export default function CustomizerPanel({ config, setConfig, onDownload }) {
  const update = (key, value) => setConfig((c) => ({ ...c, [key]: value }));

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <section>
        <h3 className="text-sm font-medium text-white mb-2">Appearance</h3>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-zinc-300">Skin Tone
            <input type="color" value={config.skin || '#e0c1a0'} onChange={(e)=>update('skin', e.target.value)} className="w-full h-8 bg-transparent" />
          </label>
          <label className="text-xs text-zinc-300">Eye Color
            <input type="color" value={config.eye || '#6fb0ff'} onChange={(e)=>update('eye', e.target.value)} className="w-full h-8 bg-transparent" />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-white mb-2">Hair</h3>
        <div className="grid grid-cols-2 gap-2">
          <select value={config.hair} onChange={(e)=>update('hair', e.target.value)} className="bg-zinc-800 text-white text-sm rounded-md px-2 py-2">
            <option value="none">None</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
            <option value="curly">Curly</option>
            <option value="straight">Straight</option>
          </select>
          <input type="color" value={config.hairColor || '#222222'} onChange={(e)=>update('hairColor', e.target.value)} className="w-full h-10 bg-transparent" />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-white mb-2">Facial Hair</h3>
        <select value={config.facialHair} onChange={(e)=>update('facialHair', e.target.value)} className="bg-zinc-800 text-white text-sm rounded-md px-2 py-2">
          <option value="none">None</option>
          <option value="moustache">Moustache</option>
          <option value="beard">Beard</option>
        </select>
      </section>

      <section>
        <h3 className="text-sm font-medium text-white mb-2">Accessories</h3>
        <select value={config.accessory} onChange={(e)=>update('accessory', e.target.value)} className="bg-zinc-800 text-white text-sm rounded-md px-2 py-2">
          <option value="none">None</option>
          <option value="glasses">Glasses</option>
          <option value="earrings">Earrings</option>
          <option value="hat">Hat</option>
        </select>
      </section>

      <section>
        <h3 className="text-sm font-medium text-white mb-2">Clothing</h3>
        <div className="grid grid-cols-2 gap-2">
          <select value={config.clothing} onChange={(e)=>update('clothing', e.target.value)} className="bg-zinc-800 text-white text-sm rounded-md px-2 py-2">
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
            <option value="jacket">Jacket</option>
          </select>
          <input type="color" value={config.clothingColor || '#4f46e5'} onChange={(e)=>update('clothingColor', e.target.value)} className="w-full h-10 bg-transparent" />
        </div>
      </section>

      <div className="mt-auto pt-2">
        <button onClick={onDownload} className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2">Download Avatar</button>
      </div>
    </div>
  );
}
