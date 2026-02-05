'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@bandachao/ui';
import {
    Settings,
    User,
    Building2,
    Shield,
    Bell,
    Store,
    Camera,
    Check,
    X,
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    Globe,
    FileText,
    AlertCircle,
    Lock,
    Edit2,
    Upload,
    Save,
    Clock,
    CheckCircle,
    Eye,
    EyeOff,
    Languages,
    CreditCard,
    MessageSquare,
} from 'lucide-react';

// Mock user profile data
const PROFILE_DATA = {
    name: 'Zhang Wei Trading Co.',
    contactName: 'Zhang Wei',
    email: 'zhang.wei@trading.com',
    phone: '+86 138 8888 8888',
    avatar: 'ZW',
    memberSince: 'January 2023',
    makerTier: 'Gold',
    totalOrders: 156,
};

// Mock business info
const BUSINESS_INFO = {
    companyName: 'Zhang Wei Trading Co., Ltd.',
    registrationNumber: '91310000MA1234567X',
    businessType: 'Manufacturing & Trading',
    industry: 'Home Goods & Crafts',
    address: '1234 Industrial Park Road, Pudong New Area, Shanghai 200120',
    website: 'www.zhangwei-trading.cn',
    description: 'Premium traditional crafts and home goods manufacturer with over 15 years of experience.',
};

// Mock verification status
const VERIFICATION_STATUS = {
    identity: 'verified',
    business: 'verified',
    bankAccount: 'verified',
    taxInfo: 'pending',
    productCerts: 'not_started',
};

// Notification settings
const NOTIFICATION_SETTINGS = [
    { id: 'new_orders', label: 'New Orders', description: 'Get notified when you receive new orders', enabled: true },
    { id: 'order_updates', label: 'Order Updates', description: 'Status changes and shipping notifications', enabled: true },
    { id: 'rfq_matches', label: 'RFQ Matches', description: 'When buyers post RFQs matching your products', enabled: true },
    { id: 'messages', label: 'Messages', description: 'New messages from buyers', enabled: true },
    { id: 'payout_updates', label: 'Payout Updates', description: 'Withdrawal status and balance alerts', enabled: true },
    { id: 'marketing', label: 'Marketing & Tips', description: 'Platform updates and selling tips', enabled: false },
];

// Storefront settings
const STOREFRONT_SETTINGS = {
    storeName: 'Zhang Wei Traditional Crafts',
    tagline: 'Premium handcrafted goods from Shanghai',
    bannerImage: null,
    logoImage: null,
    primaryColor: '#10B981',
    showReviews: true,
    showSocialLinks: true,
    autoAcceptOrders: false,
    minimumOrderValue: '¥500',
    vacationMode: false,
};

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business Info', icon: Building2 },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storefront', label: 'Storefront', icon: Store },
];

export default function MakerSettingsPage() {
    const params = useParams();
    const locale = params.locale as string;

    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);
    const [storefront, setStorefront] = useState(STOREFRONT_SETTINGS);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const toggleNotification = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
        );
    };

    const getVerificationIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle className="h-5 w-5 text-success-400" />;
            case 'pending': return <Clock className="h-5 w-5 text-warning-400" />;
            case 'not_started': return <AlertCircle className="h-5 w-5 text-slate-500" />;
            default: return null;
        }
    };

    const getVerificationLabel = (status: string) => {
        switch (status) {
            case 'verified': return 'Verified';
            case 'pending': return 'Pending Review';
            case 'not_started': return 'Not Started';
            default: return status;
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-ink-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <Settings className="h-8 w-8 text-slate-400" />
                        Maker Settings
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage your account, business info, and storefront
                    </p>
                </motion.div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="bg-ink-800 border-border">
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-panda-500 text-white'
                                                    : 'text-slate-300 hover:bg-ink-700'
                                            }`}
                                        >
                                            <tab.icon className="h-5 w-5" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white">Profile Information</CardTitle>
                                            <p className="text-sm text-slate-400 mt-1">Your personal and contact details</p>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Avatar */}
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="w-24 h-24 bg-panda-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                                                        {PROFILE_DATA.avatar}
                                                    </div>
                                                    <button className="absolute bottom-0 right-0 p-2 bg-ink-700 rounded-full border border-border hover:bg-ink-600">
                                                        <Camera className="h-4 w-4 text-white" />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{PROFILE_DATA.name}</h3>
                                                    <p className="text-slate-400">Member since {PROFILE_DATA.memberSince}</p>
                                                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-warning-500/20 text-warning-400 rounded-full text-sm">
                                                        ⭐ {PROFILE_DATA.makerTier} Maker
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Contact Name
                                                    </label>
                                                    <div className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                                                        <User className="h-5 w-5 text-slate-400" />
                                                        <span className="text-white">{PROFILE_DATA.contactName}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Email
                                                    </label>
                                                    <div className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                                                        <Mail className="h-5 w-5 text-slate-400" />
                                                        <span className="text-white">{PROFILE_DATA.email}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Phone
                                                    </label>
                                                    <div className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                                                        <Phone className="h-5 w-5 text-slate-400" />
                                                        <span className="text-white">{PROFILE_DATA.phone}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Total Orders
                                                    </label>
                                                    <div className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                                                        <FileText className="h-5 w-5 text-slate-400" />
                                                        <span className="text-white">{PROFILE_DATA.totalOrders} orders fulfilled</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button className="bg-panda-500 hover:bg-panda-600">
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Security */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white flex items-center gap-2">
                                                <Lock className="h-5 w-5 text-slate-400" />
                                                Security
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Password</p>
                                                        <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="border-border text-slate-300">
                                                    Change
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Two-Factor Authentication</p>
                                                        <p className="text-sm text-success-400">Enabled via SMS</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="border-border text-slate-300">
                                                    Manage
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Business Info Tab */}
                            {activeTab === 'business' && (
                                <motion.div
                                    key="business"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-white">Business Information</CardTitle>
                                                    <p className="text-sm text-slate-400 mt-1">Your company details for invoicing and verification</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="border-border text-slate-300">
                                                    <Edit2 className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Company Name
                                                    </label>
                                                    <div className="p-3 bg-ink-700 rounded-lg text-white">
                                                        {BUSINESS_INFO.companyName}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Registration Number
                                                    </label>
                                                    <div className="p-3 bg-ink-700 rounded-lg text-white font-mono">
                                                        {BUSINESS_INFO.registrationNumber}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Business Type
                                                    </label>
                                                    <div className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                                                        <Building2 className="h-5 w-5 text-slate-400" />
                                                        <span className="text-white">{BUSINESS_INFO.businessType}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Industry
                                                    </label>
                                                    <div className="p-3 bg-ink-700 rounded-lg text-white">
                                                        {BUSINESS_INFO.industry}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    Business Address
                                                </label>
                                                <div className="flex items-start gap-3 p-3 bg-ink-700 rounded-lg">
                                                    <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                                                    <span className="text-white">{BUSINESS_INFO.address}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    Website
                                                </label>
                                                <div className="flex items-center gap-3 p-3 bg-ink-700 rounded-lg">
                                                    <Globe className="h-5 w-5 text-slate-400" />
                                                    <span className="text-panda-400">{BUSINESS_INFO.website}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    Business Description
                                                </label>
                                                <div className="p-3 bg-ink-700 rounded-lg text-white">
                                                    {BUSINESS_INFO.description}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Verification Tab */}
                            {activeTab === 'verification' && (
                                <motion.div
                                    key="verification"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white">Verification Status</CardTitle>
                                            <p className="text-sm text-slate-400 mt-1">Complete verification to unlock higher limits and build buyer trust</p>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Verification Items */}
                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {getVerificationIcon(VERIFICATION_STATUS.identity)}
                                                    <div>
                                                        <p className="text-white font-medium">Identity Verification</p>
                                                        <p className="text-sm text-slate-400">Government ID and selfie</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    VERIFICATION_STATUS.identity === 'verified' ? 'text-success-400' :
                                                    VERIFICATION_STATUS.identity === 'pending' ? 'text-warning-400' : 'text-slate-400'
                                                }`}>
                                                    {getVerificationLabel(VERIFICATION_STATUS.identity)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {getVerificationIcon(VERIFICATION_STATUS.business)}
                                                    <div>
                                                        <p className="text-white font-medium">Business License</p>
                                                        <p className="text-sm text-slate-400">Company registration documents</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    VERIFICATION_STATUS.business === 'verified' ? 'text-success-400' :
                                                    VERIFICATION_STATUS.business === 'pending' ? 'text-warning-400' : 'text-slate-400'
                                                }`}>
                                                    {getVerificationLabel(VERIFICATION_STATUS.business)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {getVerificationIcon(VERIFICATION_STATUS.bankAccount)}
                                                    <div>
                                                        <p className="text-white font-medium">Bank Account</p>
                                                        <p className="text-sm text-slate-400">Linked payment account</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    VERIFICATION_STATUS.bankAccount === 'verified' ? 'text-success-400' :
                                                    VERIFICATION_STATUS.bankAccount === 'pending' ? 'text-warning-400' : 'text-slate-400'
                                                }`}>
                                                    {getVerificationLabel(VERIFICATION_STATUS.bankAccount)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-warning-500/10 border border-warning-500/30 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {getVerificationIcon(VERIFICATION_STATUS.taxInfo)}
                                                    <div>
                                                        <p className="text-white font-medium">Tax Information</p>
                                                        <p className="text-sm text-slate-400">Tax registration certificate</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" className="bg-warning-500 hover:bg-warning-600 text-black">
                                                    Check Status
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {getVerificationIcon(VERIFICATION_STATUS.productCerts)}
                                                    <div>
                                                        <p className="text-white font-medium">Product Certifications</p>
                                                        <p className="text-sm text-slate-400">Quality and safety certificates</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" className="border-border text-slate-300">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white">Notification Preferences</CardTitle>
                                            <p className="text-sm text-slate-400 mt-1">Choose how you want to receive updates</p>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className="flex items-center justify-between p-4 bg-ink-700 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="text-white font-medium">{notif.label}</p>
                                                        <p className="text-sm text-slate-400">{notif.description}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleNotification(notif.id)}
                                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                                            notif.enabled ? 'bg-panda-500' : 'bg-ink-600'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                                                notif.enabled ? 'translate-x-7' : 'translate-x-1'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Notification Channels */}
                                    <Card className="bg-ink-800 border-border mt-6">
                                        <CardHeader>
                                            <CardTitle className="text-white">Notification Channels</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Email</p>
                                                        <p className="text-sm text-slate-400">{PROFILE_DATA.email}</p>
                                                    </div>
                                                </div>
                                                <CheckCircle className="h-5 w-5 text-success-400" />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-white font-medium">SMS</p>
                                                        <p className="text-sm text-slate-400">{PROFILE_DATA.phone}</p>
                                                    </div>
                                                </div>
                                                <CheckCircle className="h-5 w-5 text-success-400" />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <MessageSquare className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-white font-medium">WeChat</p>
                                                        <p className="text-sm text-slate-400">Not connected</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" className="border-border text-slate-300">
                                                    Connect
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Storefront Tab */}
                            {activeTab === 'storefront' && (
                                <motion.div
                                    key="storefront"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-white">Storefront Settings</CardTitle>
                                                    <p className="text-sm text-slate-400 mt-1">Customize how your store appears to buyers</p>
                                                </div>
                                                {isEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-border text-slate-300"
                                                            onClick={() => setIsEditing(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-panda-500 hover:bg-panda-600"
                                                            onClick={handleSave}
                                                            disabled={isSaving}
                                                        >
                                                            {isSaving ? 'Saving...' : 'Save'}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-border text-slate-300"
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Store Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    Store Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={storefront.storeName}
                                                        onChange={(e) => setStorefront({ ...storefront, storeName: e.target.value })}
                                                        className="w-full px-4 py-3 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                                    />
                                                ) : (
                                                    <div className="p-3 bg-ink-700 rounded-lg text-white">
                                                        {storefront.storeName}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tagline */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    Tagline
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={storefront.tagline}
                                                        onChange={(e) => setStorefront({ ...storefront, tagline: e.target.value })}
                                                        className="w-full px-4 py-3 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                                    />
                                                ) : (
                                                    <div className="p-3 bg-ink-700 rounded-lg text-white">
                                                        {storefront.tagline}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Banner & Logo */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Store Banner
                                                    </label>
                                                    <div className="h-32 bg-ink-700 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-panda-500/50 transition-colors">
                                                        <Upload className="h-8 w-8 text-slate-500 mb-2" />
                                                        <span className="text-sm text-slate-400">Upload Banner</span>
                                                        <span className="text-xs text-slate-500">1200 x 300 px</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                                        Store Logo
                                                    </label>
                                                    <div className="h-32 bg-ink-700 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-panda-500/50 transition-colors">
                                                        <Upload className="h-8 w-8 text-slate-500 mb-2" />
                                                        <span className="text-sm text-slate-400">Upload Logo</span>
                                                        <span className="text-xs text-slate-500">200 x 200 px</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Store Options */}
                                    <Card className="bg-ink-800 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-white">Store Options</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div>
                                                    <p className="text-white font-medium">Show Reviews</p>
                                                    <p className="text-sm text-slate-400">Display customer reviews on your store</p>
                                                </div>
                                                <button
                                                    onClick={() => setStorefront({ ...storefront, showReviews: !storefront.showReviews })}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                                        storefront.showReviews ? 'bg-panda-500' : 'bg-ink-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                                            storefront.showReviews ? 'translate-x-7' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ink-700 rounded-lg">
                                                <div>
                                                    <p className="text-white font-medium">Auto-Accept Orders</p>
                                                    <p className="text-sm text-slate-400">Automatically accept incoming orders</p>
                                                </div>
                                                <button
                                                    onClick={() => setStorefront({ ...storefront, autoAcceptOrders: !storefront.autoAcceptOrders })}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                                        storefront.autoAcceptOrders ? 'bg-panda-500' : 'bg-ink-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                                            storefront.autoAcceptOrders ? 'translate-x-7' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-warning-500/10 border border-warning-500/30 rounded-lg">
                                                <div>
                                                    <p className="text-white font-medium">Vacation Mode</p>
                                                    <p className="text-sm text-slate-400">Temporarily pause new orders</p>
                                                </div>
                                                <button
                                                    onClick={() => setStorefront({ ...storefront, vacationMode: !storefront.vacationMode })}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                                        storefront.vacationMode ? 'bg-warning-500' : 'bg-ink-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                                            storefront.vacationMode ? 'translate-x-7' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                                    Minimum Order Value
                                                </label>
                                                <input
                                                    type="text"
                                                    value={storefront.minimumOrderValue}
                                                    onChange={(e) => setStorefront({ ...storefront, minimumOrderValue: e.target.value })}
                                                    className="w-full px-4 py-3 bg-ink-700 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-panda-500"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
