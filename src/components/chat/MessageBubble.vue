<template>
  <div class="w-full grid grid-cols-[40px_1fr_40px_40px] gap-2 mb-2 group">
    <div class="flex items-start justify-center pt-0.5">
      <div 
        v-if="!isMe && showAvatar" 
        class="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white bg-[#929292]"
      >
        {{ senderInitial }}
      </div>
    </div>

    <div class="flex items-start" :class="isMe ? 'justify-end' : 'justify-start'">
      <div
        class="max-w-full px-3 py-2 rounded-2xl text-sm shadow-sm relative"
        :class="[
          isMe
            ? 'rounded-br-sm' 
            // PERUBAHAN OPSI 1: Border Pesan Lawan
            : 'border border-[#E9E9E9] rounded-bl-sm', 
          message?.type === 'deleted'
            ? 'bg-gray-50 border border-gray-200 text-[#929292]'
            : isMe
              ? 'bg-[#2AA8FF] text-white'
              : 'bg-white text-[#000000]'
        ]"
        :id="`msg-${message?.id}`"
      >
        <div 
          v-if="message?.type === 'deleted'" 
          class="italic text-[#929292] flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
            <path fill-rule="evenodd" d="M8.75 1.75a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0V2.5c0-.414.336-.75.75-.75zM5.03 6.273A.75.75 0 016.095 5.17l.034-.03a11.121 11.121 0 007.697.031l.034.032a.75.75 0 111.065 1.054l-.034.03-2.071 2.072a.75.75 0 01-1.061-.006l-1.06-1.061a.75.75 0 00-1.061 0L8.163 9.38a.75.75 0 01-1.061-.006L5.15 7.391a.75.75 0 01-.119-1.118zM6.39 12.895a.75.75 0 00-1.061 0L3.13 15.151a.75.75 0 00-.056.917l.156.314A2.083 2.083 0 005.023 17.5h9.954c.73 0 1.413-.377 1.802-.992l.156-.314a.75.75 0 00-.056-.917l-2.2-2.2a.75.75 0 00-1.06 0l-.823.823a.75.75 0 01-1.06 0l-.823-.823a.75.75 0 00-1.06 0l-.823.823a.75.75 0 01-1.06 0l-.823-.823z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs italic">Pesan ini telah dihapus</span>
        </div>
        
        <template v-else>
          <p class="whitespace-pre-line break-words">
            {{ message?.text || '' }} 
          </p>

          <div
            class="text-[10px] mt-1 flex justify-end items-center" 
            :class="isMe ? 'text-white/70' : 'text-[#929292]'" 
          >
            <span v-if="isEdited" class="mr-1">
              <span class="font-semibold italic">Edited</span>
              <span class="mx-0.5">•</span> 
            </span>
            {{ formatTime(message?.created_at) }} 
          </div>
        </template>
      </div>
    </div>

    <div class="flex items-start justify-center pt-0.5">
      <button
        v-if="isMe && message?.type !== 'deleted'" 
        @click="$emit('openOptions', message)"
        class="w-6 h-6 rounded-full bg-[#E9E9E9] hover:bg-gray-200 text-[#929292] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Opsi Pesan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
        </svg>
      </button>
    </div>

    <div></div>
  </div>
</template>

<script setup>
// ... (script setup tidak ada perubahan)
import { computed } from 'vue' 

const emit = defineEmits(['openOptions']);

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isMe: {
    type: Boolean,
    default: false
  },
  showAvatar: {
    type: Boolean,
    default: false
  },
  senderData: {
    type: Object,
    default: null 
  }
})

const senderInitial = computed(() => {
    const name = props.senderData?.fullname || props.senderData?.username;
    return name ? name.charAt(0).toUpperCase() : '?';
});

const isEdited = computed(() => {
    if (props.message?.type === 'deleted') return false; 
    
    const message = props.message;

    if (message?.is_edited) {
        return true;
    }
    
    if (message?.updated_at && message?.created_at) {
        return new Date(message.updated_at).getTime() > new Date(message.created_at).getTime() + 1000; 
    }

    return false;
});

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  try {
    const date = new Date(timestamp)
    if (isNaN(date)) return 'Waktu Tidak Valid'
    const formatter = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      minute: '2-digit',
      hour12: false, 
      timeZone: 'Asia/Jakarta' 
    })
    return `${formatter.format(date)} WIB`
  } catch (error) {
    return 'Error Format Waktu'
  }
}
</script>