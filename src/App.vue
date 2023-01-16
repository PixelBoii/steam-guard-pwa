<script setup>
import { ref } from 'vue';
import SteamTotp from './steam-totp.js';

const savedSharedSecret = ref(localStorage.getItem('sharedSecret'));
const sharedSecret = ref('');

function getAuthCode() {
  try {
    return SteamTotp.generateAuthCode(savedSharedSecret.value);
  } catch (e) {
    return '';
  }
}

function refreshValues() {
  code.value = getAuthCode();

  timeLeft.value = 30 - (Math.floor(Date.now() / 1000) % 30);
}

const code = ref('');
const timeLeft = ref(30);

setInterval(refreshValues, 1000);

// On page load
refreshValues();

function submit() {
  localStorage.setItem('sharedSecret', sharedSecret.value);
  savedSharedSecret.value = sharedSecret.value;
}

function copyCode() {
  navigator.clipboard.writeText(code.value);
}

function reset() {
  localStorage.removeItem('sharedSecret');
  savedSharedSecret.value = '';
}
</script>

<template>
  <div class="h-screen w-screen bg-gray-700 flex items-center justify-center text-center">
    <div v-if="savedSharedSecret">
      <div>
        <h1 class="text-xl font-semibold text-gray-200"> Current Steam Guard Code </h1>

        <div class="px-6 py-4 mt-4 bg-gray-600 rounded-md cursor-pointer hover:bg-gray-500 transition"
          @click="copyCode">
          <p class="text-white font-bold text-2xl"> {{ code }} </p>
        </div>

        <div class="h-1 w-full bg-blue-500 transition duration-1000 ease-linear" :style="{ transform: `scaleX(${timeLeft / 30})` }"></div>
      </div>

      <div class="fixed bottom-6 inset-x-0 mx-auto flex items-center justify-center cursor-pointer">
        <p class="text-gray-200 font-semibold text-lg" @click="reset"> Reset </p>
      </div>
    </div>

    <div v-else>
      <form @submit.prevent="submit">
        <h1 class="text-gray-200 text-xl font-semibold"> Set up </h1>

        <div class="flex items-center space-x-2 mt-4">
          <input
            class="rounded-md bg-gray-600 border-gray-500 border-2 text-white py-2 px-3 active:outline-none focus:outline-none"
            type="password"
            v-model="sharedSecret"
            placeholder="Shared Secret"
          />

          <button
            class="bg-gray-500 rounded-md text-white px-3 py-2 font-semibold"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>