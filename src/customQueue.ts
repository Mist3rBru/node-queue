export class Queue {
  private procs: Promise<any>[] = []
  private runningProcs: Promise<any>[] = []

  add (proc: Promise<any>): void {
    this.procs.push(proc)
  }

  async process (maxParallelProcs: number): Promise<any> {
    if (!this.procs.length && !this.runningProcs.length) return null
    if (this.runningProcs.length >= maxParallelProcs) {
      await this.runningProcs[0]
      return this.process(maxParallelProcs)
    }
    const promise = this.procs.shift()
    this.runningProcs.push(promise)
    const result = await promise.finally(() => {
      this.runningProcs = this.runningProcs.filter(p => p !== promise)
    })
    return result
  }
}
