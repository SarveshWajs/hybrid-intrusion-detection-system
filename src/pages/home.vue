<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <header class="text-center">
        <h1 class="text-4xl font-bold text-indigo-600">🔐 Hybrid IDS Dashboard</h1>
        <p class="text-gray-500 mt-2">Analyze traffic using AI & rule-based intrusion detection</p>
      </header>

      <!-- Drag & Drop Upload Area -->
    <div
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="mb-6 p-6 border-4 border-dashed border-indigo-400 rounded cursor-pointer text-center text-indigo-600 hover:bg-indigo-50 transition"
    >
      <p class="mb-2 font-semibold">Drag & Drop a JSON or CSV file here</p>
      <p class="text-sm text-gray-500">or click to select a file</p>
      <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect" />
      <button @click="$refs.fileInput.click()" type="button" class="mt-2 text-indigo-600 underline">Select File</button>
    </div>

    <!-- Manual Traffic Form -->
    <form @submit.prevent="submitAnalysis" class="space-y-4" novalidate>
      <div>
        <label class="block font-semibold mb-1">Source IP Address</label>
        <input
          v-model="traffic.src_ip"
          type="text"
          placeholder="e.g. 192.168.1.10"
          class="w-full border rounded p-2"
          :class="{ 'border-red-500': errors.src_ip }"
          autocomplete="off"
        />
        <p v-if="errors.src_ip" class="text-red-600 text-sm mt-1">{{ errors.src_ip }}</p>
      </div>

      <div>
        <label class="block font-semibold mb-1">Destination IP Address</label>
        <input
          v-model="traffic.dst_ip"
          type="text"
          placeholder="e.g. 10.0.0.5"
          class="w-full border rounded p-2"
          :class="{ 'border-red-500': errors.dst_ip }"
          autocomplete="off"
        />
        <p v-if="errors.dst_ip" class="text-red-600 text-sm mt-1">{{ errors.dst_ip }}</p>
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block font-semibold mb-1">Source Port</label>
          <input
            v-model.number="traffic.src_port"
            type="number"
            min="1"
            max="65535"
            class="w-full border rounded p-2"
            :class="{ 'border-red-500': errors.src_port }"
            placeholder="e.g. 443"
          />
          <p v-if="errors.src_port" class="text-red-600 text-sm mt-1">{{ errors.src_port }}</p>
        </div>

        <div class="flex-1">
          <label class="block font-semibold mb-1">Destination Port</label>
          <input
            v-model.number="traffic.dst_port"
            type="number"
            min="1"
            max="65535"
            class="w-full border rounded p-2"
            :class="{ 'border-red-500': errors.dst_port }"
            placeholder="e.g. 80"
          />
          <p v-if="errors.dst_port" class="text-red-600 text-sm mt-1">{{ errors.dst_port }}</p>
        </div>
      </div>

      <div>
        <label class="block font-semibold mb-1">Protocol</label>
        <select v-model="traffic.protocol" class="w-full border rounded p-2" :class="{ 'border-red-500': errors.protocol }">
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="ICMP">ICMP</option>
          <option value="Other">Other</option>
        </select>
        <p v-if="errors.protocol" class="text-red-600 text-sm mt-1">{{ errors.protocol }}</p>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ loading ? "Analyzing..." : "Analyze Traffic" }}
      </button>
    </form>

    <!-- Analysis Result -->
    <div
      v-if="result"
      class="mt-6 p-4 rounded"
      :class="result.is_anomaly ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
    >
      <p class="font-semibold text-lg">{{ result.message }}</p>
      <p v-if="result.action" class="mt-1">Recommended Action: <strong>{{ result.action }}</strong></p>
    </div>
  </div>
  </div>
</template>


<script setup>
import { ref, reactive } from "vue"
import axios from "axios"
import * as yup from "yup"
import { ElMessage } from "element-plus"

// Yup validation schema
const schema = yup.object({
  src_ip: yup
    .string()
    .required("Source IP is required")
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
      "Source IP must be a valid IPv4 address"
    ),
  dst_ip: yup
    .string()
    .required("Destination IP is required")
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
      "Destination IP must be a valid IPv4 address"
    ),
  src_port: yup
    .number()
    .required("Source port is required")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535"),
  dst_port: yup
    .number()
    .required("Destination port is required")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535"),
  protocol: yup.string().required("Protocol is required").oneOf(["TCP", "UDP", "ICMP", "Other"]),
})

const traffic = reactive({
  src_ip: "",
  dst_ip: "",
  src_port: null,
  dst_port: null,
  protocol: "TCP",
})

const errors = reactive({})

const result = ref(null)
const loading = ref(false)

const submitAnalysis = async () => {
  loading.value = true
  result.value = null
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""))

  try {
    await schema.validate(traffic, { abortEarly: false })

    // If validation passes, call backend
    const res = await axios.post("http://localhost:5000/analyze", traffic)
    result.value = {
      message: res.data.result,
      is_anomaly: res.data.result.toLowerCase().includes("anomaly"),
      action: res.data.action || null,
    }
    ElMessage.success("Traffic analyzed successfully!")
  } catch (err) {
    if (err.name === "ValidationError") {
      // Map validation errors
      err.inner.forEach((e) => {
        errors[e.path] = e.message
      })
      ElMessage.error("Please fix the validation errors before submitting.")
    } else {
      ElMessage.error("Failed to analyze traffic. Please try again.")
    }
  } finally {
    loading.value = false
  }
}

// Drag & drop handlers unchanged, but wrapped in try/catch with Element Plus message

const handleDrop = async (event) => {
  loading.value = true
  result.value = null
  try {
    const files = event.dataTransfer.files
    if (files.length === 0) return
    await readAndAnalyzeFile(files[0])
  } catch (error) {
    ElMessage.error("Error handling dropped file: " + error.message)
  } finally {
    loading.value = false
  }
}

const handleFileSelect = async (event) => {
  loading.value = true
  result.value = null
  try {
    const files = event.target.files
    if (files.length === 0) return
    await readAndAnalyzeFile(files[0])
  } catch (error) {
    ElMessage.error("Error handling selected file: " + error.message)
  } finally {
    loading.value = false
  }
}

const readAndAnalyzeFile = async (file) => {
  try {
    const text = await file.text()
    let data

    if (file.name.endsWith(".json")) {
      data = JSON.parse(text)
      if (Array.isArray(data)) data = data[0]
    } else if (file.name.endsWith(".csv")) {
      const lines = text.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())
      const values = lines[1].split(",").map((v) => v.trim())
      data = headers.reduce((obj, key, i) => {
        const val = isNaN(values[i]) ? values[i] : Number(values[i])
        obj[key] = val
        return obj
      }, {})
    } else {
      throw new Error("Unsupported file type")
    }

    // Validate data before sending
    await schema.validate(data, { abortEarly: false })

    const res = await axios.post("http://localhost:5000/analyze", data)
    result.value = {
      message: res.data.result,
      is_anomaly: res.data.result.toLowerCase().includes("anomaly"),
      action: res.data.action || null,
    }
    ElMessage.success("File analyzed successfully!")
  } catch (error) {
    if (error.name === "ValidationError") {
      ElMessage.error("File content validation failed: " + error.errors.join(", "))
    } else {
      ElMessage.error("Error reading or analyzing file: " + error.message)
    }
  }
}
</script>