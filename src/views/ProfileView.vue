<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const isEditMode = ref(false); // View mode or Edit mode
const activeTab = ref('profile'); // profile, password (for edit mode)
const loading = ref(false);
const message = ref({ type: '', text: '' });

const profileForm = reactive({
  fullname: '',
  email: '',
  bio: '',
  contact: ''
});

const passwordForm = reactive({
  old_password: '',
  new_password: '',
  new_password_confirmation: ''
});

const photoPreview = ref(null);
const photoFile = ref(null);

onMounted(async () => {
  try {
    loading.value = true;
    await authStore.fetchProfile();
    populateProfileForm();
    populateProfileForm();
  } catch (error) {
    showMessage('error', 'Failed to load profile: ' + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
});

function populateProfileForm() {
  if (authStore.user) {
    profileForm.fullname = authStore.user.fullname || '';
    profileForm.email = authStore.user.email || '';
    profileForm.bio = authStore.user.bio || '';
    profileForm.contact = authStore.user.contact || '';
  }
}

function showMessage(type, text) {
  message.value = { type, text };
  setTimeout(() => {
    message.value = { type: '', text: '' };
  }, 3000);
}

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
  if (!isEditMode.value) {
    activeTab.value = 'profile';
    populateProfileForm(); // Reset form when exiting edit mode
  }
}

async function handleUpdateProfile() {
  try {
    loading.value = true;
    await authStore.updateProfile(profileForm);
    showMessage('success', 'Profile updated successfully');
    isEditMode.value = false; // Exit edit mode after successful update
  } catch (error) {
    showMessage('error', 'Failed to update profile');
  } finally {
    loading.value = false;
  }
}

async function handleUpdatePassword() {
  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    showMessage('error', 'Password confirmation does not match');
    return;
  }
  try {
    loading.value = true;
    await authStore.updatePassword(passwordForm);
    showMessage('success', 'Password updated successfully');
    passwordForm.old_password = '';
    passwordForm.new_password = '';
    passwordForm.new_password_confirmation = '';
    isEditMode.value = false; // Exit edit mode after successful update
  } catch (error) {
    showMessage('error', 'Failed to update password');
  } finally {
    loading.value = false;
  }
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Maximum file size is 2MB');
      return;
    }
    photoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
}

async function handleUploadPhoto() {
  if (!photoFile.value) return;
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append('photo', photoFile.value);
    await authStore.updatePhoto(formData);
    showMessage('success', 'Profile photo uploaded successfully');
    photoFile.value = null;
    photoPreview.value = null;
  } catch (error) {
    showMessage('error', 'Failed to upload photo');
  } finally {
    loading.value = false;
  }
}

async function handleDeletePhoto() {
  if (!confirm('Are you sure you want to delete your profile photo?')) return;
  try {
    loading.value = true;
    await authStore.deletePhoto();
    showMessage('success', 'Profile photo deleted successfully');
  } catch (error) {
    showMessage('error', 'Failed to delete photo');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 relative p-4 font-sans overflow-hidden">
    
    <!-- Background Effects (Matching Login) -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none" 
         style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blueLight rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blueHeadline rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow" style="animation-delay: 2s;"></div>
    </div>

    <!-- Main Card -->
    <div class="z-10 bg-base shadow-2xl rounded-[30px] flex flex-col md:flex-row w-full max-w-6xl overflow-hidden animate-fadein border border-white/50 min-h-[600px]">

      <!-- Left Side: User Summary -->
      <div class="w-full md:w-[35%] bg-gradient-to-br from-blueHeadline to-bluePrimary p-8 text-white flex flex-col items-center justify-center relative overflow-hidden">
        
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-blueLight rounded-full mix-blend-overlay opacity-50 blur-2xl"></div>
        <div class="absolute -bottom-32 -left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay opacity-20 blur-3xl"></div>
        
        <div class="relative z-10 flex flex-col items-center text-center">
          <div class="relative group mb-6">
            <div class="w-32 h-32 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-white/10 backdrop-blur-sm">
               <img 
                :src="photoPreview || (authStore.user?.photo_url || 'https://via.placeholder.com/150')" 
                alt="Profile Photo" 
                class="w-full h-full object-cover"
              />
            </div>
            <label for="photo-upload" class="absolute bottom-0 right-0 bg-white text-blueHeadline p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
            </label>
            <input type="file" id="photo-upload" @change="onFileChange" accept="image/*" hidden />
          </div>

          <div v-if="photoFile" class="flex gap-2 mb-4 animate-fadein">
            <button @click="handleUploadPhoto" class="px-3 py-1 bg-white text-blueHeadline rounded-full text-xs font-bold hover:bg-blue-50 transition">Save</button>
            <button @click="photoFile = null; photoPreview = null" class="px-3 py-1 bg-transparent border border-white text-white rounded-full text-xs font-bold hover:bg-white/10 transition">Cancel</button>
          </div>
           <div v-if="!photoFile && authStore.user?.photo && authStore.user?.photo !== 'default.png'" class="mb-4">
             <button @click="handleDeletePhoto" class="text-xs text-white/80 hover:text-white underline transition">Delete Photo</button>
           </div>

          <h2 class="text-2xl font-bold font-namaApp tracking-wide mb-1">{{ authStore.user?.fullname || 'Loading...' }}</h2>
          <p class="text-blue-100 text-sm font-medium mb-1">@{{ authStore.user?.username }}</p>
          <p class="text-blue-100/80 text-xs font-medium mb-4">{{ authStore.user?.email || '-' }}</p>
          <p class="text-white/90 text-sm leading-relaxed max-w-xs italic">
            "{{ authStore.user?.bio || 'No bio yet' }}"
          </p>
        </div>
      </div>

      <!-- Right Side: Content (View or Edit Mode) -->
      <div class="w-full md:w-[65%] bg-base p-8 lg:p-12 flex flex-col">
        
        <!-- Alert Message -->
        <div v-if="message.text" :class="['mb-6 p-4 rounded-xl flex items-start gap-3 animate-fadein', message.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-green-50 border border-green-100 text-green-600']">
            <span class="font-medium text-sm">{{ message.text }}</span>
        </div>

        <!-- VIEW MODE -->
        <div v-if="!isEditMode" class="animate-fadein">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-headline font-namaApp">My Profile</h3>
            <button @click="toggleEditMode" class="px-6 py-2 bg-blueHeadline text-white rounded-xl font-bold text-sm hover:bg-bluePrimary hover:shadow-lg hover:shadow-blueHeadline/30 transition-all duration-300">
              Edit Profile
            </button>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-detail uppercase tracking-wider">Full Name</label>
              <div class="px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-headline">
                {{ authStore.user?.fullname || '-' }}
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-detail uppercase tracking-wider">Email</label>
              <div class="px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-headline">
                {{ authStore.user?.email || '-' }}
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-detail uppercase tracking-wider">Contact</label>
              <div class="px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-headline">
                {{ authStore.user?.contact || '-' }}
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-detail uppercase tracking-wider">Bio</label>
              <div class="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-headline min-h-[100px]">
                {{ authStore.user?.bio || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- EDIT MODE -->
        <div v-else class="animate-fadein">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-headline font-namaApp">Edit Profile</h3>
            <button @click="toggleEditMode" class="px-6 py-2 bg-gray-100 text-detail rounded-xl font-bold text-sm hover:bg-gray-200 transition-all duration-300">
              Cancel
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex gap-6 border-b border-gray-100 mb-8">
            <button 
              @click="activeTab = 'profile'"
              :class="['pb-3 text-sm font-bold tracking-wide transition-all duration-300 relative', 
                activeTab === 'profile' ? 'text-blueHeadline' : 'text-detail hover:text-headline']"
            >
              Edit Profile
              <span v-if="activeTab === 'profile'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blueHeadline rounded-full"></span>
            </button>
            <button 
              @click="activeTab = 'password'"
              :class="['pb-3 text-sm font-bold tracking-wide transition-all duration-300 relative', 
                activeTab === 'password' ? 'text-blueHeadline' : 'text-detail hover:text-headline']"
            >
              Change Password
              <span v-if="activeTab === 'password'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blueHeadline rounded-full"></span>
            </button>
          </div>

          <!-- Profile Form -->
          <form v-if="activeTab === 'profile'" @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-detail uppercase tracking-wider">Full Name</label>
                <input v-model="profileForm.fullname" type="text" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all" required />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-detail uppercase tracking-wider">Email</label>
                <input v-model="profileForm.email" type="email" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all" required />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-detail uppercase tracking-wider">Contact</label>
                <input v-model="profileForm.contact" type="text" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all" />
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-bold text-detail uppercase tracking-wider">Bio</label>
              <textarea v-model="profileForm.bio" rows="4" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all resize-none"></textarea>
            </div>

            <div class="pt-4">
              <button type="submit" :disabled="loading" class="px-8 py-3 bg-blueHeadline text-white rounded-xl font-bold text-sm hover:bg-bluePrimary hover:shadow-lg hover:shadow-blueHeadline/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>

          <!-- Password Form -->
          <form v-if="activeTab === 'password'" @submit.prevent="handleUpdatePassword" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-detail uppercase tracking-wider">Old Password</label>
              <input v-model="passwordForm.old_password" type="password" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-detail uppercase tracking-wider">New Password</label>
                <input v-model="passwordForm.new_password" type="password" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all" required />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-detail uppercase tracking-wider">Confirm Password</label>
                <input v-model="passwordForm.new_password_confirmation" type="password" class="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-headline focus:outline-none focus:ring-2 focus:ring-blueHeadline focus:bg-white transition-all" required />
              </div>
            </div>

            <div class="pt-4">
              <button type="submit" :disabled="loading" class="px-8 py-3 bg-blueHeadline text-white rounded-xl font-bold text-sm hover:bg-bluePrimary hover:shadow-lg hover:shadow-blueHeadline/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
                {{ loading ? 'Processing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reuse animations from Login.vue */
@keyframes fadein {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadein {
  animation: fadein 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.3; }
}
.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}
</style>
