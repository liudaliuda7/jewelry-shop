'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  MapPin, 
  User, 
  Phone, 
  Home, 
  Building, 
  Star,
  ChevronDown,
  AlertTriangle,
  Info,
  Tag,
  Edit3,
  Check,
  Hash
} from 'lucide-react';
import { useAddress } from '@/contexts/AddressContext';
import { useTag } from '@/contexts/TagContext';
import { Address, AddressTag, CustomTag } from '@/types/data';
import { getProvinces, getCities, getDistricts } from '@/types/data';

interface AddressFormData {
  name: string;
  phone: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  address: string;
  zipCode: string;
  tag: AddressTag | undefined;
  isDefault: boolean;
}

const initialFormData: AddressFormData = {
  name: '',
  phone: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  zipCode: '',
  tag: undefined,
  isDefault: false,
};

interface TagColor {
  border: string;
  bg: string;
  text: string;
}

const tagColorSchemes: TagColor[] = [
  { border: 'border-rose-400', bg: 'bg-rose-50', text: 'text-rose-600' },
  { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-600' },
  { border: 'border-green-400', bg: 'bg-green-50', text: 'text-green-600' },
  { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-600' },
  { border: 'border-orange-400', bg: 'bg-orange-50', text: 'text-orange-600' },
  { border: 'border-teal-400', bg: 'bg-teal-50', text: 'text-teal-600' },
];

const getTagColor = (index: number): TagColor => {
  return tagColorSchemes[index % tagColorSchemes.length];
};

const tagOptions: { value: AddressTag | undefined; label: string }[] = [
  { value: 'home', label: '家' },
  { value: 'work', label: '公司' },
];

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
  const { customTags, addTag, deleteTag } = useTag();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'info'>('error');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);

  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  useEffect(() => {
    if (formData.provinceCode) {
      const province = provinces.find(p => p.code === formData.provinceCode);
      setFormData(prev => ({ 
        ...prev, 
        provinceName: province?.name || ''
      }));
      setCities(getCities(formData.provinceCode));
      setFormData(prev => ({ ...prev, cityCode: '', cityName: '', districtCode: '', districtName: '' }));
      setDistricts([]);
    }
  }, [formData.provinceCode, provinces]);

  useEffect(() => {
    if (formData.cityCode && formData.provinceCode) {
      const city = cities.find(c => c.code === formData.cityCode);
      setFormData(prev => ({ 
        ...prev, 
        cityName: city?.name || ''
      }));
      setDistricts(getDistricts(formData.provinceCode, formData.cityCode));
      setFormData(prev => ({ ...prev, districtCode: '', districtName: '' }));
    }
  }, [formData.cityCode, formData.provinceCode, cities]);

  useEffect(() => {
    if (formData.districtCode) {
      const district = districts.find(d => d.code === formData.districtCode);
      setFormData(prev => ({ 
        ...prev, 
        districtName: district?.name || ''
      }));
    }
  }, [formData.districtCode, districts]);

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData(initialFormData);
    setCities([]);
    setDistricts([]);
    setShowModal(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      provinceCode: address.provinceCode,
      provinceName: address.provinceName,
      cityCode: address.cityCode,
      cityName: address.cityName,
      districtCode: address.districtCode,
      districtName: address.districtName,
      address: address.address,
      zipCode: address.zipCode || '',
      tag: address.tag,
      isDefault: address.isDefault,
    });
    setCities(getCities(address.provinceCode));
    setDistricts(getDistricts(address.provinceCode, address.cityCode));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(initialFormData);
    setIsAddingTag(false);
    setNewTagName('');
    setHoveredTagId(null);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean | AddressTag | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.provinceCode || !formData.cityCode || !formData.districtCode || !formData.address) {
      setAlertMessage('请填写完整的地址信息');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, {
        ...formData,
      });
    } else {
      addAddress({
        ...formData,
      });
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    setDeletingAddressId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingAddressId) {
      deleteAddress(deletingAddressId);
    }
    setShowDeleteConfirm(false);
    setDeletingAddressId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingAddressId(null);
  };

  const getTagInfo = (tag?: AddressTag) => {
    if (!tag) return null;
    const found = tagOptions.find(t => t.value === tag);
    if (found) return { ...found, isPreset: true };
    const customTag = customTags.find(t => t.id === tag || t.name === tag);
    if (customTag) {
      return { value: customTag.id, label: customTag.name, isPreset: false, tagData: customTag };
    }
    return null;
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const isDuplicate = [
        ...tagOptions.map(t => t.label.toLowerCase()),
        ...customTags.map(t => t.name.toLowerCase())
      ].includes(newTagName.trim().toLowerCase());
      
      if (!isDuplicate) {
        addTag(newTagName.trim());
      }
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const handleCancelAddTag = () => {
    setNewTagName('');
    setIsAddingTag(false);
  };

  const handleDeleteCustomTag = (id: string) => {
    const tag = customTags.find(t => t.id === id);
    if (tag) {
      const updatedAddresses = addresses.map(addr => {
        if (addr.tag === id || addr.tag === tag.name) {
          return { ...addr, tag: undefined };
        }
        return addr;
      });
      updatedAddresses.forEach(addr => {
        if (addresses.find(a => a.id === addr.id)?.tag !== addr.tag) {
          updateAddress(addr.id, { tag: addr.tag });
        }
      });
    }
    if (formData.tag === id) {
      setFormData(prev => ({ ...prev, tag: undefined }));
    }
    deleteTag(id);
    setHoveredTagId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">收货地址</h3>
            <p className="text-gray-500 text-sm">管理您的收货地址</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            新增地址
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-gray-300" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">暂无收货地址</h4>
            <p className="text-gray-500 mb-8">您还没有添加任何收货地址</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              添加收货地址
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => {
              const tagInfo = getTagInfo(address.tag);
              return (
                <div
                  key={address.id}
                  className={`p-6 border-2 rounded-xl transition-all hover:shadow-md ${
                    address.isDefault 
                      ? 'border-rose-400 bg-rose-50/30' 
                      : 'border-gray-200 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-800 text-lg">{address.name}</span>
                        <span className="text-gray-600">{address.phone}</span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            默认
                          </span>
                        )}
                        {tagInfo && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                            {tagInfo.icon}
                            {tagInfo.label}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {address.provinceName} {address.cityName} {address.districtName} {address.address}
                        {address.zipCode && ` (邮编: ${address.zipCode})`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {!address.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(address.id)}
                          className="px-3 py-1.5 text-sm text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          设为默认
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(address)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingAddress ? '编辑地址' : '新增地址'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    收货人 *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="请输入收货人姓名"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号码 *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="请输入手机号码"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    省份 *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.provinceCode}
                      onChange={(e) => handleInputChange('provinceCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none appearance-none bg-white pr-10"
                    >
                      <option value="">请选择省份</option>
                      {provinces.map(province => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    城市 *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.cityCode}
                      onChange={(e) => handleInputChange('cityCode', e.target.value)}
                      disabled={!formData.provinceCode}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none appearance-none bg-white pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">请选择城市</option>
                      {cities.map(city => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    区县 *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.districtCode}
                      onChange={(e) => handleInputChange('districtCode', e.target.value)}
                      disabled={!formData.cityCode}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none appearance-none bg-white pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">请选择区县</option>
                      {districts.map(district => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详细地址 *
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="请输入详细地址（街道、门牌号等）"
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮政编码
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="请输入邮政编码（选填）"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
                <div></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  标签
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {tagOptions.map((option, index) => {
                    const color = getTagColor(index);
                    const isSelected = formData.tag === option.value;
                    return (
                      <button
                        key={option.value || 'none'}
                        type="button"
                        onClick={() => handleInputChange('tag', option.value)}
                        className={`relative group px-4 py-2 rounded-full border-2 transition-all ${
                          isSelected
                            ? `${color.border} ${color.bg} ${color.text} ring-2 ring-offset-1 ${color.border.replace('border-', 'ring-')}`
                            : `${color.border} ${color.bg} ${color.text} hover:shadow-md`
                        }`}
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                  
                  {customTags.map((tag, index) => {
                    const color = getTagColor(tagOptions.length + index);
                    const isSelected = formData.tag === tag.id;
                    const isHovered = hoveredTagId === tag.id;
                    return (
                      <div
                        key={tag.id}
                        className="relative"
                        onMouseEnter={() => setHoveredTagId(tag.id)}
                        onMouseLeave={() => setHoveredTagId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => handleInputChange('tag', tag.id)}
                          className={`relative px-4 py-2 pr-8 rounded-full border-2 transition-all ${
                            isSelected
                              ? `${color.border} ${color.bg} ${color.text} ring-2 ring-offset-1 ${color.border.replace('border-', 'ring-')}`
                              : `${color.border} ${color.bg} ${color.text} hover:shadow-md`
                          }`}
                        >
                          <span className="text-sm font-medium">{tag.name}</span>
                        </button>
                        {isHovered && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomTag(tag.id);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            title="删除标签"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  
                  {isAddingTag ? (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full border-2 border-dashed border-gray-300">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="标签名称"
                        className="w-24 px-2 py-1 bg-transparent border-none outline-none text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTag();
                          } else if (e.key === 'Escape') {
                            handleCancelAddTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!newTagName.trim()}
                        className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="保存"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAddTag}
                        className="p-1 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
                        title="取消"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(true)}
                      className="px-4 py-2 rounded-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">添加标签</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  鼠标悬停在自定义标签上可删除标签，删除后使用该标签的地址将变为无标签
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => handleInputChange('isDefault', !formData.isDefault)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      formData.isDefault
                        ? 'border-rose-600 bg-rose-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {formData.isDefault && (
                      <Star className="w-4 h-4 text-white fill-current" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">设为默认地址</p>
                    <p className="text-sm text-gray-500">下单时将自动填充此地址</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
              >
                {editingAddress ? '保存修改' : '保存地址'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                确认删除
              </h3>
              <p className="text-gray-500 text-center mb-6">
                确定要删除这个地址吗？此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAlert(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
                alertType === 'error' ? 'bg-amber-100' : 'bg-blue-100'
              }`}>
                {alertType === 'error' ? (
                  <AlertTriangle className={`w-8 h-8 ${alertType === 'error' ? 'text-amber-600' : 'text-blue-600'}`} />
                ) : (
                  <Info className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <p className="text-gray-700 text-center mb-6">
                {alertMessage}
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
