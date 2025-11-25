<template>
  <div class="px-4 pt-4 flex flex-col min-h-full justify-end">
    <MessageLoader v-if="loading" />
    
    <div class="flex-1"></div>
    
    <div v-for="(message, index) in messages.filter(m => m)" :key="message.id">
      <MessageBubble
        :message="message"
        :isMe="String(message.user_id) === String(currentUserId)" 
        :id="`msg-${message.id}`"
        
        :showAvatar="shouldShowAvatar(message, index)"
        :senderData="getSenderData(message.user_id)"
        
        :isGroupChat="isGroupChat"
        @openOptions="$emit('open-edit-menu', $event)" 
      />
    </div>
    
    <div v-if="!loading && messages.length === 0" class="text-center text-[#929292] mt-8">
      Belum ada pesan dalam obrolan ini.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChatStore } from '@/stores/chat/useChatStore';
import MessageBubble from "@/components/chat/MessageBubble.vue";
import MessageLoader from "@/components/chat/MessageLoader.vue";

const props = defineProps({
// ... (props lainnya)
  messages: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentUserId: {
    type: [Number, String],
    required: true,
  },
});

// Menghubungkan event dari MessageBubble ke ChatDetailPage
defineEmits(['open-edit-menu']);

const chatStore = useChatStore();

const isGroupChat = computed(() => {
    return !!chatStore.activeChat?.name; 
});

const activeParticipants = computed(() => {
    return chatStore.activeChat?.participants || [];
});

function getSenderData(userId) {
    const participant = activeParticipants.value.find(p => String(p.id) === String(userId));
    return participant || null;
}

function shouldShowAvatar(message, index) {
    const isMe = String(message.user_id) === String(props.currentUserId);
    
    if (isMe) {
        return false;
    }

    const nextMessage = props.messages[index + 1];

    if (!nextMessage) {
        return true;
    }
    
    const isNextMessageFromDifferentSender = String(nextMessage.user_id) !== String(message.user_id);
    
    return isNextMessageFromDifferentSender;
}
</script>