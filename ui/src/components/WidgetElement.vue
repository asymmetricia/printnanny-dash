<template>
  <div
    class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md"
  >
    <div class="flex px-4 pt-4 grid grid-cols-2">
      <!-- toggle-->

      <Switch
        v-model="store.items[idx].enabled"
        :class="store.items[idx].enabled ? 'bg-blue-600' : 'bg-gray-200'"
        class="relative inline-flex h-6 w-11 items-center rounded-full"
      >
        <span class="sr-only">Enable {{ item.name }}</span>
        <span
          :class="item.enabled ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        />
      </Switch>

      <WidgetStatus :item="item" class="justify-self-end" />
    </div>
    <div class="flex flex-col items-center pb-10">
      <img
        class="mb-3 w-24 h-24 rounded-full shadow-lg"
        :src="item.logo"
        :alt="item.name"
      />
      <h5 class="mb-1 text-xl font-medium text-gray-900">
        {{ item.name }}
      </h5>
      <span class="text-sm text-gray-500 text-center">{{
        item.description
      }}</span>

      <div class="flex mt-4 space-x-3 md:mt-6">
        <a
          :href="item.href"
          target="_blank"
          class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          <ArrowUpRightIcon
            class="w-4 h-4 text-sm font-medium mr-1 text-white-600"
          />
          Open {{ item.name }}
        </a>
        <WidgetMenu :items="item.menuItems" v-if="item.menuItems.length > 0" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { Switch } from "@headlessui/vue";
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import WidgetMenu from "@/components/WidgetMenu.vue";
import WidgetStatus from "@/components/WidgetStatus.vue";
import type { WidgetItem } from "@/types";
import { useWidgetStore } from "@/stores/widgets";

const store = useWidgetStore();

const props = defineProps({
  item: {
    type: Object as PropType<WidgetItem>,
    required: true,
  },
});

const idx = store.items.findIndex((el) => el.service === props.item.service);

store.$subscribe(async (mutation: any, _state: any) => {
  if (
    mutation.events.target &&
    mutation.events.target.service === props.item.service
  ) {
    const enabled = mutation.events.newValue;
    if (enabled === true) {
      await store.enableService(props.item);
    } else if (enabled === false) {
      await store.disableService(props.item);
    }
  }
});
</script>
