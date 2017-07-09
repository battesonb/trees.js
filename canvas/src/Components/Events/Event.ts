export default abstract class Event {
    private listeners: (() => any)[];

    Event() {
        this.listeners = [];
    }

    /**
     * Adds the given event listener to the event.
     * @param callback 
     */
    addEventListener(callback: () => any): void {
        this.listeners.push(callback);
    }

    /**
     * Removes the given event listener from the event.
     * @param callback 
     * @returns true if the callback was found and deleted.
     */
    removeEventListener(callback: () => any): boolean {
        for(var i = 0; i < this.listeners.length; i++) {
            if(this.listeners[i] === callback) {
                this.listeners.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * Emits the event, calling all listeners.
     */
    emit(): void {
        for(var i = 0; i < this.listeners.length; i++) {
            this.listeners[i]();
        }
    }
}