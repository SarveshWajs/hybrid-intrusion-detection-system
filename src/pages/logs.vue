<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-indigo-600">📜 Detection Logs</h1>
        <p class="text-gray-500">Historical detection activity from the hybrid IDS</p>
      </header>

      <!-- Filters and Actions -->
      <div class="flex flex-wrap justify-between items-center bg-white p-4 rounded shadow space-y-2 md:space-y-0 md:space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Search IP or Result..."
          class="border p-2 rounded w-64"
        />

        <select v-model="severityFilter" class="border p-2 rounded">
          <option value="">All Severities</option>
          <option value="anomaly">Anomaly</option>
          <option value="normal">Normal</option>
        </select>

        <select v-model="sortOption" class="border p-2 rounded">
          <option value="timestamp">Sort by Timestamp</option>
          <option value="src_ip">Sort by IP</option>
        </select>

        <button
          @click="exportCSV"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export CSV
        </button>
      </div>

      <!-- Logs Table -->
      <div class="overflow-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-indigo-100 text-indigo-800 font-semibold">
            <tr>
              <th class="p-3">Timestamp</th>
              <th class="p-3">Source IP</th>
              <th class="p-3">Destination Port</th>
              <th class="p-3">Result</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 divide-y">
            <tr v-for="log in paginatedLogs" :key="log.id">
              <td class="p-3">{{ new Date(log.timestamp).toLocaleString() }}</td>
              <td class="p-3">{{ log.src_ip }}</td>
              <td class="p-3">{{ log.dst_port }}</td>
              <td class="p-3">
                <span
                  :class="log.result.toLowerCase().includes('anomaly') ? 'text-red-600' : 'text-green-600'"
                >
                  {{ log.result }}
                </span>
              </td>
              <td class="p-3">
                <button @click="confirmDelete(log.id)" class="text-red-600 hover:underline">
                  🗑️ Delete
                </button>
              </td>
            </tr>
            <tr v-if="paginatedLogs.length === 0">
              <td colspan="5" class="p-3 text-center text-gray-400">
                No matching logs found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center space-x-2 mt-4">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const logs = ref([])
const searchQuery = ref('')
const severityFilter = ref('')
const sortOption = ref('timestamp')
const currentPage = ref(1)
const pageSize = 10

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/logs')
    logs.value = res.data.logs.map((log, index) => ({
      ...log,
      id: index.toString() // use unique identifier if available
    }))
  } catch (err) {
    console.error('Failed to fetch logs', err)
    ElMessage({
      type: 'error',
      message: 'Failed to fetch logs from server'
    })
  }
})

const sortedLogs = computed(() => {
  return [...logs.value].sort((a, b) => {
    if (sortOption.value === 'timestamp') {
      return new Date(b.timestamp) - new Date(a.timestamp)
    }
    if (sortOption.value === 'src_ip') {
      return a.src_ip.localeCompare(b.src_ip)
    }
    return 0
  })
})

const filteredLogs = computed(() => {
  return sortedLogs.value.filter((log) => {
    const matchQuery =
      log.src_ip.includes(searchQuery.value) ||
      log.result.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSeverity =
      !severityFilter.value ||
      (severityFilter.value === 'anomaly' &&
        log.result.toLowerCase().includes('anomaly')) ||
      (severityFilter.value === 'normal' &&
        !log.result.toLowerCase().includes('anomaly'))
    return matchQuery && matchSeverity
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredLogs.value.length / pageSize)
)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const deleteLog = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/logs/${id}`)
    logs.value = logs.value.filter((log) => log.id !== id)
  } catch (err) {
    throw new Error('Deletion failed')
  }
}

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this log?',
      'Warning',
      {
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    await deleteLog(id)
    ElMessage({
      type: 'success',
      message: 'Log deleted successfully'
    })
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage({
        type: 'error',
        message: 'Failed to delete the log'
      })
    }
  }
}

const exportCSV = () => {
  const headers = ['Timestamp', 'Source IP', 'Destination Port', 'Result']
  const rows = filteredLogs.value.map((log) => [
    new Date(log.timestamp).toLocaleString(),
    log.src_ip,
    log.dst_port,
    log.result
  ])
  const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'detection_logs.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
