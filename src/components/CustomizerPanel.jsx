import React from 'react';

const hairOptions = [
  { label: 'None', value: 'none' },
  { label: 'Short', value: 'short' },
  { label: 'Long', value: 'long' },
  { label: 'Curly', value: 'curly' },
  { label: 'Straight', value: 'straight' },
];

const clothingOptions = [
  { label: 'Shirt', value: 'shirt' },
  { label: 'Jacket', value: 'jacket' },
  { label: 'Hoodie', value: 'hoodie' },
  { label: 'Pants', value: 'pants' },
  { label: 'Shorts', value: 'shorts' },
  { label: 'Skirt', value: 'skirt' },
];

const facialHairOptions = [
  { label: 'None', value: 'none' },
  { label: 'Beard', value: 'beard' },
  { label: 'Moustache', value: 'moustache' },
];

const accessoryOptions = [
  { label: 'None', value: 'none' },
  { label: 'Glasses', value: 'glasses' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Hat', value: 'hat' },
];

export default function CustomizerPanel({ config, setConfig, onDownload }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Hair</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={config.hair}
            onChange={(e) => setConfig((c) => ({ ...c, hair: e.target.value }))}
          >
            {hairOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Clothing</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={config.clothing}
            onChange={(e) => setConfig((c) => ({ ...c, clothing: e.target.value }))}
          >
            {clothingOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Facial Hair</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={config.facialHair}
            onChange={(e) => setConfig((c) => ({ ...c, facialHair: e.target.value }))}
          >
            {facialHairOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Accessories</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={config.accessory}
            onChange={(e) => setConfig((c) => ({ ...c, accessory: e.target.value }))}
          >
            {accessoryOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Skin Tone</label>
          <input
            type="color"
            className="w-full h-10 rounded-md border border-gray-300"
            value={config.skinTone}
            onChange={(e) => setConfig((c) => ({ ...c, skinTone: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Eye Color</label>
          <input
            type="color"
            className="w-full h-10 rounded-md border border-gray-300"
            value={config.eyeColor}
            onChange={(e) => setConfig((c) => ({ ...c, eyeColor: e.target.value }))}
          />
        </div>
      </div>

      <div className="pt-4">
        <button onClick={onDownload} className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Download Avatar (PNG)
        </button>
      </div>
    </div>
  );
}
