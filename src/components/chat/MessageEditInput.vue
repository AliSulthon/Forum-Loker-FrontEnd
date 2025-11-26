<template>
    <div class="p-3 border-t bg-gray-50 flex flex-col shadow-inner">
        <div class="flex justify-between items-center mb-2 px-2 text-sm">
            <span class="text-[#2AA8FF] font-semibold flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square"></i>
                Mengedit Pesan
            </span>
            <button 
                @click="$emit('cancel')" 
                class="text-[#929292] hover:text-red-600 transition"
                title="Batalkan Edit"
            >
                <i class="fa-solid fa-xmark"></i> Batalkan
            </button>
        </div>

        <div class="flex items-center gap-2">
            <input
                v-model="editedText"
                @keyup.enter.prevent="handleConfirm"
                type="text"
                placeholder="Edit pesan..."
                class="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2AA8FF] focus:border-[#2AA8FF] outline-none transition-all"
            />
            
            <button
                @click="handleConfirm"
                :disabled="!editedText.trim() || editedText.trim() === initialText.trim()"
                class="w-10 h-10 flex items-center justify-center rounded-lg transition"
                :class="[
                // Disabled State: Abu-abu Netral
                !editedText.trim() || editedText.trim() === initialText.trim() 
                    ? 'bg-[#E9E9E9] text-[#929292] cursor-not-allowed' 
                    // Active State: Biru Cerah #2AA8FF, Hover ke Varian Biru yang Lebih Gelap
                    : 'bg-[#2AA8FF] text-white hover:bg-[#1C8DFF]'
                ]"
                title="Konfirmasi Edit"
            >
                <img src="@/assets/send.svg" alt="Konfirmasi" class="w-5 h-5" /> 
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from "@/stores/auth"; 

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['cancel', 'confirm']);

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id);

const editedText = ref(props.message.text || '');
const initialText = ref(props.message.text || '');

const handleConfirm = () => {
    if (editedText.value.trim() && editedText.value.trim() !== initialText.value.trim()) {
        emit('confirm', editedText.value.trim());
    } else {
        emit('cancel');
    }
};
</script>