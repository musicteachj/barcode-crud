<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Pinia Counter Example</v-card-title>
          <v-card-text>
            <p>Count: {{ counter.count }}</p>
            <p>Double Count: {{ counter.doubleCount }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="counter.increment" color="primary">
              Increment
            </v-btn>
            <v-btn @click="counter.decrement" color="secondary">
              Decrement
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
</script>
