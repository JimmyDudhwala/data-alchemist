"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, ClipboardList, UserCheck, AlertTriangle, Database, Upload } from "lucide-react"

import DataTable from "@/components/DataGrid"
import ExportButton from "@/components/ExportButton"
import FileUploader from "@/components/FileUploader"
import LLMSearchBar from "@/components/LLMSearchBar"
import { type ClientData, type TaskData, useDataStore, type WorkerData } from "@/store/useDataStore"
import { validateCrossFile } from "@/components/errors/crossValidators"
import NLModifyForm from "@/components/NLModifyForm"
import Navbar from "@/components/Navbar"

export default function Home() {
  const clients = useDataStore((state) => state.clients)
  const setClients = useDataStore((state) => state.setClients)
  const tasks = useDataStore((store) => store.tasks)
  const setTasks = useDataStore((store) => store.setTasks)
  const workers = useDataStore((store) => store.workers)
  const setWorkers = useDataStore((store) => store.setWorkers)
  const setCrossFileErrors = useDataStore((s) => s.setCrossFileErrors)
  const crossFileErrors = useDataStore((s) => s.crossFileErrors)

  const [filteredClients, setFilteredClients] = useState<ClientData[]>(clients)
  const [filteredTasks, setFilteredTasks] = useState<TaskData[]>(tasks)
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerData[]>(workers)
  const [activeTab, setActiveTab] = useState("upload")

  useEffect(() => {
    if (clients.length && tasks.length && workers.length) {
      const errors = validateCrossFile(clients, tasks, workers)
      setCrossFileErrors(errors)
    }

    setFilteredClients(clients)
    setFilteredTasks(tasks)
    setFilteredWorkers(workers)

    // Auto-switch to data view when data is loaded
    // if ((clients.length > 0 && tasks.length > 0 && workers.length > 0) && activeTab === "upload") {
    //   setActiveTab("data")
    // }
  }, [clients, tasks, workers, setCrossFileErrors, activeTab])

  const handleParsed = (data: ClientData[] | TaskData[] | WorkerData[], name: string) => {
    if (name === "clients") setClients(data as ClientData[])
    else if (name === "tasks") setTasks(data as TaskData[])
    else if (name === "workers") setWorkers(data as WorkerData[])
  }

  const getDataStats = () => ({
    clients: clients.length,
    tasks: tasks.length,
    workers: workers.length,
    errors: crossFileErrors.length,
  })

  const stats = getDataStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar stats={stats} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Data Management Hub</h1>
          <p className="text-gray-400 text-lg">Upload, analyze, and manage your data with AI-powered tools</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              Manage Data
            </TabsTrigger>
            <TabsTrigger
              value="validation"
              className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload CSV Files
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload your client, task, and worker data files to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onDataParsed={handleParsed} />
              </CardContent>
            </Card>

            {(stats.clients > 0 || stats.tasks > 0 || stats.workers > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Clients</p>
                        <p className="text-2xl font-bold text-white">{stats.clients}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Tasks</p>
                        <p className="text-2xl font-bold text-white">{stats.tasks}</p>
                      </div>
                      <ClipboardList className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Workers</p>
                        <p className="text-2xl font-bold text-white">{stats.workers}</p>
                      </div>
                      <UserCheck className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {clients.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Clients
                    </div>
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {clients.length} records
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LLMSearchBar data={clients} tableType="clients" onFiltered={setFilteredClients} />
                  <NLModifyForm tableType="clients" data={clients} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilteredClients(clients)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                    <ExportButton data={filteredClients} filename="clients_updated.csv" />
                  </div>
                  <DataTable tableType="clients" data={filteredClients} onChange={setClients} />
                </CardContent>
              </Card>
            )}

            {tasks.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <ClipboardList className="w-5 h-5 mr-2" />
                      Tasks
                    </div>
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      {tasks.length} records
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LLMSearchBar data={tasks} tableType="tasks" onFiltered={setFilteredTasks} />
                  <NLModifyForm tableType="tasks" data={tasks} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilteredTasks(tasks)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                    <ExportButton data={filteredTasks} filename="tasks_updated.csv" />
                  </div>
                  <DataTable tableType="tasks" data={filteredTasks} onChange={setTasks} />
                </CardContent>
              </Card>
            )}

            {workers.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="w-5 h-5 mr-2" />
                      Workers
                    </div>
                    <Badge variant="secondary" className="bg-purple-600 text-white">
                      {workers.length} records
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LLMSearchBar data={workers} tableType="workers" onFiltered={setFilteredWorkers} />
                  <NLModifyForm tableType="workers" data={workers} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilteredWorkers(workers)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                    <ExportButton data={filteredWorkers} filename="workers_updated.csv" />
                  </div>
                  <DataTable tableType="workers" data={filteredWorkers} onChange={setWorkers} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="validation">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Data Validation
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Review cross-file validation errors and data integrity issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {crossFileErrors.length > 0 ? (
                  <Alert className="bg-yellow-900/20 border-yellow-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-200">
                      <div className="space-y-2">
                        <p className="font-semibold">Found {crossFileErrors.length} validation errors:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {crossFileErrors.map((err, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{err.file}</span>
                              {err.rowIndex >= 0 ? ` (Row ${err.rowIndex + 1})` : ""}: {err.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-green-900/20 border-green-600">
                    <AlertDescription className="text-green-200">
                      ✅ No validation errors found. Your data looks good!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
