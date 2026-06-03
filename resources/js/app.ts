import '../css/app.css'
import Alpine from 'alpinejs'

(globalThis as { Alpine?: typeof Alpine }).Alpine = Alpine
Alpine.start()
