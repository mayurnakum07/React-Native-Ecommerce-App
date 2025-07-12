import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components';
import { COLORS, Layout } from '../theme';

const CARD_RADIUS = 18;
const CARD_SHADOW = {
  shadowColor: COLORS.accent2,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

// Login Form Component
const LoginForm = ({ onLogin }: { onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await onLogin(email, password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" delay={100} style={styles.loginContainer}>
      <View style={styles.loginHeader}>
        <Ionicons name="person-circle-outline" size={60} color={COLORS.accent1} />
        <Text style={styles.loginTitle}>Welcome Back</Text>
        <Text style={styles.loginSubtitle}>Sign in to access your profile</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={COLORS.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.subtext}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.subtext} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.subtext}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.accent1, COLORS.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginGradient}
          >
            {isLoading ? (
              <Text style={styles.loginButtonText}>Signing In...</Text>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

// Profile Menu Item Component
const ProfileMenuItem = ({ icon, title, subtitle, onPress, delay, showArrow = true }: { icon: string; title: string; subtitle?: string; onPress: () => void; delay: number; showArrow?: boolean }) => (
  <Animatable.View
    animation="fadeInUp"
    delay={delay}
    duration={600}
    style={styles.menuItemWrapper}
  >
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={icon} size={22} color={COLORS.accent1} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.subtext2} />
      )}
    </TouchableOpacity>
  </Animatable.View>
);

// Edit Profile Modal Component
const EditProfileModal = ({ user, onSave, onCancel, isVisible }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onSave({ name: name.trim(), email: email.trim() });
  };

  if (!isVisible) return null;

  return (
    <View style={styles.modalOverlay}>
      <Animatable.View animation="fadeInUp" style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={onCancel} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={COLORS.subtext}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalCancelButton} onPress={onCancel}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
            <LinearGradient
              colors={[COLORS.accent1, COLORS.accent2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalSaveGradient}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { user, isAuthenticated, isLoading, login, logout, updateProfile } = useAuth();
  const { checkOnboardingStatus } = useAppContext();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              await checkOnboardingStatus();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleProfileUpdate = async (updates) => {
    try {
      await updateProfile(updates);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const menuItems = [
    {
      icon: 'bag-outline',
      title: 'Order History',
      subtitle: 'View your past orders',
      onPress: () => Alert.alert('Order History', 'Order history functionality would go here'),
      delay: 100
    },
    {
      icon: 'heart-outline',
      title: 'Saved Items',
      subtitle: 'Your wishlist and favorites',
      onPress: () => Alert.alert('Saved Items', 'Saved items functionality would go here'),
      delay: 150
    },
    {
      icon: 'location-outline',
      title: 'Address Management',
      subtitle: 'Manage your delivery addresses',
      onPress: () => Alert.alert('Address Management', 'Address management functionality would go here'),
      delay: 200
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => Alert.alert('Payment Methods', 'Payment methods functionality would go here'),
      delay: 250
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      onPress: () => Alert.alert('Settings', 'Settings functionality would go here'),
      delay: 300
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help & Support', 'Help and support functionality would go here'),
      delay: 350
    }
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <AnimatedLogo size="medium" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {!isAuthenticated ? (
            <LoginForm onLogin={login} />
          ) : (
            <>
              {/* User Profile Section */}
              <Animatable.View animation="fadeInUp" delay={50} style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: user?.avatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                  <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.7}>
                    <Ionicons name="camera" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>

                <TouchableOpacity
                  style={styles.editProfileBtn}
                  activeOpacity={0.7}
                  onPress={() => setShowEditModal(true)}
                >
                  <LinearGradient
                    colors={[COLORS.accent1, COLORS.accent2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.editProfileGradient}
                  >
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>

              {/* Menu Items */}
              <View style={styles.menuSection}>
                {menuItems.map((item, index) => (
                  <ProfileMenuItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    onPress={item.onPress}
                    delay={item.delay}
                  />
                ))}
              </View>

              {/* Logout Button */}
              <Animatable.View animation="fadeInUp" delay={400} style={styles.logoutSection}>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[COLORS.dark, COLORS.accent3]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.logoutGradient}
                  >
                    <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
                    <Text style={styles.logoutText}>Logout</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            </>
          )}
        </ScrollView>

        {/* Edit Profile Modal */}
        <EditProfileModal
          user={user}
          onSave={handleProfileUpdate}
          onCancel={() => setShowEditModal(false)}
          isVisible={showEditModal}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: Layout.tabBarHeight ,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.subtext,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
  },
  // Login Form Styles
  loginContainer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...CARD_SHADOW,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
  },
  loginButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginGradient: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  // Profile Section Styles
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.accent1,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent1,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.subtext,
    marginBottom: 20,
    textAlign: 'center',
  },
  editProfileBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editProfileGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItemWrapper: {
    marginBottom: 8,
  },
  menuItem: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CARD_SHADOW,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: COLORS.subtext,
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logoutBtn: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoutGradient: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    padding: 24,
    marginHorizontal: 32,
    width: '100%',
    maxWidth: 400,
    ...CARD_SHADOW,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    gap: 16,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProfileScreen; 