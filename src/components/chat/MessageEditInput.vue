<template>
    <div class="p-3 border-t bg-gray-50 flex flex-col shadow-inner">
        <div class="flex justify-between items-center mb-2 px-2 text-sm">
            <span class="text-[#2AA8FF] font-semibold flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square"></i>
                Mengedit Pesan
            </span>
            <button 
                @click="$emit('cancel')" 
                class="text-gray-500 hover:text-red-500 transition"
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
                :class="[!editedText.trim() || editedText.trim() === initialText.trim() ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#2AA8FF] text-white hover:bg-[#1C8DFF]']"
                title="Konfirmasi Edit"
            >
                <i class="fa-solid fa-check"></i>
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
    // Cek apakah ada perubahan dan bukan pesan kosong
    if (editedText.value.trim() && editedText.value.trim() !== initialText.value.trim()) {
        emit('confirm', editedText.value.trim());
    } else {
        // Jika tidak ada perubahan atau input kosong, langsung batalkan
        emit('cancel');
    }
};
</script>