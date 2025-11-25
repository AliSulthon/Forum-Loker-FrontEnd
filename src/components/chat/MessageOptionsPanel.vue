<template>
    <Transition name="fade">
        <div 
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            @click.self="$emit('close')"
        >
            <div class="bg-white rounded-lg p-6 shadow-2xl w-full max-w-sm transform transition-all">
                
                <h3 class="text-lg font-bold mb-4 text-[#000000]">Opsi Pesan</h3> 
                
                <p class="text-sm text-[#929292] mb-4 italic max-h-12 overflow-hidden truncate">
                    Pesan: "{{ message?.text || 'Pesan kosong' }}"
                </p>

                <button 
                    v-if="message.type !== 'deleted'"
                    @click="$emit('edit')" 
                    class="w-full text-left py-2 px-3 hover:bg-[#E9E9E9] rounded-md flex items-center text-[#2AA8FF] transition duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-3"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
                    Edit Pesan
                </button>
                <hr v-if="message.type !== 'deleted'" class="my-2 border-gray-100">

                <button 
                    v-if="message.type !== 'deleted'"
                    @click="confirmDelete('all')" 
                    class="w-full text-left py-2 px-3 hover:bg-red-50 rounded-md flex items-center text-red-600 font-semibold transition duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-3"><path fill-rule="evenodd" d="M8.75 1.75a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zm-.827 9.874l-2.071 2.071a.75.75 0 001.06 1.06l2.07-2.071 2.072 2.071a.75.75 0 001.06-1.06l-2.071-2.072 2.071-2.07a.75.75 0 10-1.06-1.06l-2.071 2.07-2.07-2.07a.75.75 0 00-1.06 1.06l2.07 2.07zM1.75 8.75C1.75 4.88 4.88 1.75 8.75 1.75h2.5c3.87 0 7 3.13 7 7v2.5c0 3.87-3.13 7-7 7h-2.5c-3.87 0-7-3.13-7-7v-2.5zM3.25 8.75v2.5c0 3.033 2.467 5.5 5.5 5.5h2.5c3.033 0 5.5-2.467 5.5-5.5v-2.5c0-3.033-2.467-5.5-5.5-5.5h-2.5c-3.033 0-5.5 2.467-5.5 5.5z" clip-rule="evenodd" /></svg>
                    Hapus untuk Semua
                </button>
                <hr class="my-2 border-gray-100">

                <button 
                    @click="confirmDelete('me')" 
                    class="w-full text-left py-2 px-3 hover:bg-[#E9E9E9] rounded-md flex items-center text-[#929292] transition duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-3"><path d="M3.25 4A2.25 2.25 0 001 6.25v9.5A2.25 2.25 0 003.25 18h11.5A2.25 2.25 0 0017 15.75v-9.5A2.25 2.25 0 0014.75 4H3.25zM12 7.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zm-3 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75z" /><path d="M2.5 3.25a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" /></svg>
                    Hapus untuk Saya
                </button>

                <button 
                    @click="$emit('close')" 
                    class="w-full mt-4 py-2 bg-[#E9E9E9] hover:bg-gray-200 rounded-md text-[#000000] font-medium transition duration-150"
                >
                    Batal
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
});

const emit = defineEmits(['close', 'edit', 'delete-for-me', 'delete-for-all']);

// Fungsi untuk konfirmasi sebelum menghapus
const confirmDelete = (scope) => {
    const confirmation = scope === 'all'
        ? "Apakah Anda yakin ingin menghapus pesan ini untuk SEMUA orang di obrolan ini?"
        : "Apakah Anda yakin ingin menghapus pesan ini HANYA untuk Anda?";
        
    if (confirm(confirmation)) {
        if (scope === 'all') {
            emit('delete-for-all');
        } else {
            emit('delete-for-me');
        }
    }
}
</script>

<style scoped>
/* Transisi sederhana untuk modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>