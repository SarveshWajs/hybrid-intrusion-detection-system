<template>
  <div class="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-8">
    <div class="max-w-7xl mx-auto space-y-10">
      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-indigo-700 tracking-wide mb-2">
          📊 Model Insights Dashboard
        </h1>
        <p class="text-gray-600 text-lg max-w-xl mx-auto">
          View real-time metrics for rule-based, ML-based, and hybrid intrusion detection models.
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16 text-gray-400 text-xl">
        Loading model metrics...
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-16 text-red-600 text-xl">
        Failed to load metrics: {{ error }}
      </div>

      <!-- No Metrics State -->
      <div v-if="!loading && !error && Object.keys(metrics || {}).length === 0" class="text-center text-gray-500 text-lg">
        No model metrics available.
      </div>

      <!-- Structured Metrics Grid -->
      <div v-if="!loading && !error && Object.keys(metrics || {}).length > 0"
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(modelMetrics, modelName) in metrics"
          :key="modelName"
          class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-indigo-400 transition-shadow duration-300"
        >
          <h2 class="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-3 capitalize">
            <ModelIcon :name="modelName" />
            {{ modelName.replace('_', ' ') }} Model
          </h2>

          <div class="space-y-3">
            <div>
              <h3 class="text-sm text-gray-500">True Positives (TP)</h3>
              <p class="text-lg font-bold text-green-700">{{ modelMetrics.TP }}</p>
            </div>
            <div>
              <h3 class="text-sm text-gray-500">False Positives (FP)</h3>
              <p class="text-lg font-bold text-red-700">{{ modelMetrics.FP }}</p>
            </div>
            <div>
              <h3 class="text-sm text-gray-500">True Negatives (TN)</h3>
              <p class="text-lg font-bold text-green-700">{{ modelMetrics.TN }}</p>
            </div>
            <div>
              <h3 class="text-sm text-gray-500">False Negatives (FN)</h3>
              <p class="text-lg font-bold text-red-700">{{ modelMetrics.FN }}</p>
            </div>
            <div>
              <h3 class="text-sm text-gray-500">Detection Rate</h3>
             <p class="text-lg font-bold text-purple-700">
              {{ modelMetrics.DetectionRate?.toFixed(4) ?? 'N/A' }}
            </p>
            </div>
            <div>
              <h3 class="text-sm text-gray-500">False Positive Rate</h3>
              <p class="text-lg font-bold text-red-600">
              {{ modelMetrics.FalsePositiveRate?.toFixed(4) ?? 'N/A' }}
            </p>
            </div>
            <div>
              <h3 class="text-sm text-gray-500">Avg Response Time (s)</h3>
              <p class="text-lg font-bold text-gray-700">
              {{ modelMetrics.AvgResponseTime?.toFixed(6) ?? 'N/A' }}
            </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent } from 'vue'
import axios from 'axios'

// State refs
const metrics = ref({})
const loading = ref(true)
const error = ref(null)

// Fetch metrics on component mount
onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('http://localhost:5000/model_metrics')
    metrics.value = res.data
  } catch (err) {
    error.value = err.message || 'Unknown error'
  } finally {
    loading.value = false
  }
})

// ModelIcon component
const ModelIcon = defineComponent({
  props: ['name'],
  template: `
    <span v-if="name==='rule_based'" class="text-green-500" title="Rule-based Model">⚙️</span>
    <span v-else-if="name==='ml_based'" class="text-blue-500" title="ML-based Model">🤖</span>
    <span v-else-if="name==='hybrid'" class="text-purple-500" title="Hybrid Model">🛡️</span>
    <span v-else>❓</span>
  `,
})
</script>

<style scoped>
.shadow-lg {
  transition: box-shadow 0.3s ease;
}
</style>
