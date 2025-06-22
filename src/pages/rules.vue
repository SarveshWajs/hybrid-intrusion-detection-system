<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-indigo-600">🛡️ Rule Manager</h1>
        <p class="text-gray-500">Manage pattern-based rules for intrusion detection</p>
      </header>

      <!-- Add Rule Button -->
      <div class="flex justify-end">
        <button
          @click="isDialogOpen = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Add Rule
        </button>
      </div>

      <!-- Filters & Sort -->
      <div class="bg-white rounded-lg shadow p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <input
          v-model="searchQuery"
          placeholder="🔍 Filter by name, pattern, action..."
          class="w-full md:w-1/3 p-2 border rounded"
        />

        <div class="flex gap-4 mt-2 md:mt-0">
          <select v-model="selectedCategory" class="p-2 border rounded">
            <option value="">All Categories</option>
            <option>General</option>
            <option>SQL Injection</option>
            <option>DDoS</option>
            <option>Malware</option>
            <option>Brute Force</option>
            <option>XSS</option>
          </select>

          <select v-model="sortOption" class="p-2 border rounded">
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="hits">Hits</option>
          </select>
        </div>
      </div>

      <!-- Rule List -->
      <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-3">📋 Current Rules</h2>

        <ul v-if="paginatedRules.length" class="divide-y">
          <li
            v-for="(rule, index) in paginatedRules"
            :key="index"
            class="py-3 flex justify-between items-start"
          >
            <div>
              <div class="font-semibold text-indigo-700">{{ rule.name }}</div>
              <div class="font-mono text-gray-800 text-sm">{{ rule.pattern }}</div>
              <div class="text-xs text-gray-600 flex gap-3 mt-1">
                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{{ rule.action }}</span>
                <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">{{ rule.category }}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded">Hits: {{ rule.hits }}</span>
              </div>
            </div>
            <button @click="deleteRule(index)" class="text-red-600 hover:underline mt-1">🗑️ Delete</button>
          </li>
        </ul>

        <p v-else class="text-gray-400 italic text-center py-4">No rules match your filters.</p>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-4 gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 border rounded"
            :class="{
              'bg-indigo-600 text-white': currentPage === page,
              'bg-white text-gray-700': currentPage !== page
            }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Rule Modal -->
    <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
        <button @click="isDialogOpen = false" class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">
          ×
        </button>
        <h3 class="text-lg font-semibold mb-4 text-indigo-700">➕ Add New Rule</h3>

        <form @submit.prevent="addRule" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Name</label>
            <input v-model="newRule.name" class="w-full p-2 border rounded" />
            <p v-if="showValidation && !newRule.name" class="text-red-500 text-sm mt-1">Name is required</p>
          </div>

          <div>
            <label class="block text-sm font-medium">Pattern</label>
            <input v-model="newRule.pattern" class="w-full p-2 border rounded" />
            <p v-if="showValidation && !newRule.pattern" class="text-red-500 text-sm mt-1">Pattern is required</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Action</label>
              <select v-model="newRule.action" class="w-full p-2 border rounded">
                <option>ALERT</option>
                <option>BLOCK</option>
                <option>LOG</option>
                <option>EMAIL</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium">Category</label>
              <select v-model="newRule.category" class="w-full p-2 border rounded">
                <option>General</option>
                <option>SQL Injection</option>
                <option>DDoS</option>
                <option>Malware</option>
                <option>Brute Force</option>
                <option>XSS</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              ✅ Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:5000'

const rules = ref([])
const newRule = ref({
  name: '',
  pattern: '',
  action: 'ALERT',
  category: 'General'
})
const showValidation = ref(false)
const isDialogOpen = ref(false)

const searchQuery = ref('')
const selectedCategory = ref('')
const sortOption = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const fetchRules = async () => {
  try {
    const res = await axios.get(`${API_BASE}/rules`)
    rules.value = res.data
  } catch (err) {
    console.error('Failed to fetch rules:', err)
  }
}

const addRule = async () => {
  showValidation.value = true
  if (!newRule.value.name.trim() || !newRule.value.pattern.trim()) return

  const ruleData = {
    ...newRule.value,
    hits: 0
  }

  try {
    await axios.post(`${API_BASE}/rules`, ruleData)
    await fetchRules()
    newRule.value = { name: '', pattern: '', action: 'ALERT', category: 'General' }
    showValidation.value = false
    isDialogOpen.value = false
  } catch (err) {
    console.error('Failed to add rule:', err)
  }
}

const deleteRule = async (index) => {
  try {
    await axios.delete(`${API_BASE}/rules/${index}`)
    await fetchRules()
  } catch (err) {
    console.error('Failed to delete rule:', err)
  }
}

const filteredRules = computed(() => {
  let filtered = rules.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(rule =>
      rule.name.toLowerCase().includes(q) ||
      rule.pattern.toLowerCase().includes(q) ||
      rule.action.toLowerCase().includes(q) ||
      rule.category.toLowerCase().includes(q)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(rule => rule.category === selectedCategory.value)
  }

  if (sortOption.value === 'name') {
    filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption.value === 'hits') {
    filtered = filtered.slice().sort((a, b) => b.hits - a.hits)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRules.value.length / itemsPerPage))

const paginatedRules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRules.value.slice(start, start + itemsPerPage)
})

onMounted(fetchRules)
</script>

