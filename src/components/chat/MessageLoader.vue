<template>
  <div class="w-full flex justify-center py-3">
    <div class="flex items-center gap-2 text-[#929292] text-sm">
      <span class="loader-dot"></span>
      <span class="loader-dot"></span>
      <span class="loader-dot"></span>
    </div>
  </div>
</template>

<style scoped>
.loader-dot {
  width: 6px;
  height: 6px;
  /* Mengganti warna dot dengan Detailed Text #929292 */
  background: #929292; 
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}

.loader-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loader-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  from { transform: translateY(0); opacity: 0.5; }
  to { transform: translateY(-6px); opacity: 1; }
}
</style>