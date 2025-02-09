<template>
  <div class="flex w-full p-2">
    <div
      v-if="cloudStore.user !== undefined"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 mx-auto"
    >
      <h2 class="text-xl font-bold text-gray-900 prose mb-4">
        Account Information
      </h2>

      <p class="block text-gray-700 text-sm font-bold mb-4">
        Logged in as: {{ cloudStore.user.email }}
      </p>

      <a href="https://printnanny.ai/devices">
        <button
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          PrintNanny Cloud
        </button>
      </a>
    </div>
    <Form
      @submit="submitStage1"
      v-else-if="formStage == 1"
      :validation-schema="formSchema1"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 mx-auto"
    >
      <h2 class="text-xl font-bold text-gray-900 prose mb-4">
        Connect Account
      </h2>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <Field
          name="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="text"
          placeholder="Enter your email address"
        />
        <ErrorMessage name="email" />
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Send temporary login code
        </button>
      </div>
    </Form>
    <Form
      @submit="submitStage2"
      v-else-if="formStage == 2"
      :validation-schema="formSchema2"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/2 mx-auto"
    >
      <h2 class="text-xl font-bold text-gray-900 prose mb-4">
        Connect Account
      </h2>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
          <ErrorMessage name="email" />
        </label>
        <Field
          name="email"
          disabled
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="text"
          :placeholder="formEmail"
          :value="formEmail"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="token">
          6-digit Code
        </label>
        <Field
          name="token"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="text"
          placeholder="Enter 6-digit code"
        />
        <ErrorMessage name="token" />
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Connect Account
        </button>
        <TextSpinner text="Verifying..." v-if="formLoading" />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useCloudStore } from "@/stores/cloud";
import TextSpinner from "@/components/TextSpinner.vue";

const formStage = ref(1);
const formEmail = ref("");
const formLoading = ref(false);

const cloud = useCloudStore();

async function submitStage1(values: any) {
  const res = await cloud.twoFactorStage1(values.email);
  if (res === true) {
    formStage.value = 2;
    formEmail.value = values.email;
  }
}

async function submitStage2(values: any) {
  formLoading.value = true;
  const res = await cloud.twoFactorStage2(values.email, values.token);
  if (res) {
    await cloud.fetchUser();
  }

  formLoading.value = false;
}

const formSchema1 = yup.object({
  email: yup.string().required().email(),
});

const formSchema2 = yup.object({
  email: yup.string().email(),
  token: yup.string().required(),
});

const cloudStore = useCloudStore();
</script>
