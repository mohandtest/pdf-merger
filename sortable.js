/**
 * Custom Drag and Drop Sortable Implementation
 * Replaces SortableJS dependency with lightweight custom solution
 */

class CustomSortable {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            animation: options.animation || 150,
            ghostClass: options.ghostClass || 'sortable-ghost',
            onEnd: options.onEnd || (() => {}),
            ...options
        };
        
        this.draggedElement = null;
        this.placeholder = null;
        this.draggedIndex = -1;
        this.targetIndex = -1;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.element.addEventListener('dragover', this.handleDragOver.bind(this));
        this.element.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.element.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.element.addEventListener('drop', this.handleDrop.bind(this));
        this.element.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        // Make items draggable
        this.updateDraggableItems();
    }
    
    updateDraggableItems() {
        const items = this.element.querySelectorAll('.file-item');
        items.forEach((item, index) => {
            item.draggable = true;
            item.dataset.index = index;
        });
    }
    
    handleDragStart(e) {
        if (!e.target.closest('.file-item')) return;
        
        this.draggedElement = e.target.closest('.file-item');
        this.draggedIndex = parseInt(this.draggedElement.dataset.index);
        
        // Add ghost class
        this.draggedElement.classList.add(this.options.ghostClass);
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.draggedElement.outerHTML);
        
        // Create placeholder
        this.createPlaceholder();
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const targetItem = e.target.closest('.file-item');
        if (!targetItem || targetItem === this.draggedElement) return;
        
        this.updatePlaceholder(targetItem, e);
    }
    
    handleDragEnter(e) {
        e.preventDefault();
    }
    
    handleDragLeave(e) {
        // Only handle if leaving the container entirely
        if (!this.element.contains(e.relatedTarget)) {
            this.removePlaceholder();
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        if (!this.placeholder) return;
        
        const targetItem = this.placeholder.nextElementSibling;
        this.targetIndex = targetItem ? 
            parseInt(targetItem.dataset.index) : 
            this.element.children.length - 1;
        
        // Adjust target index if moving down
        if (this.draggedIndex < this.targetIndex) {
            this.targetIndex--;
        }
        
        // Move the actual element
        this.moveElement();
        
        // Trigger callback
        this.options.onEnd({
            oldIndex: this.draggedIndex,
            newIndex: this.targetIndex
        });
    }
    
    handleDragEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove(this.options.ghostClass);
        }
        
        this.removePlaceholder();
        this.draggedElement = null;
        this.draggedIndex = -1;
        this.targetIndex = -1;
    }
    
    createPlaceholder() {
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'sortable-placeholder';
        this.placeholder.style.cssText = `
            height: ${this.draggedElement.offsetHeight}px;
            margin: 10px 0;
            background: #e3f2fd;
            border: 2px dashed #007bff;
            border-radius: 4px;
            opacity: 0.5;
            transition: all ${this.options.animation}ms ease;
        `;
    }
    
    updatePlaceholder(targetItem, e) {
        if (!this.placeholder) return;
        
        const rect = targetItem.getBoundingClientRect();
        const mouseY = e.clientY;
        const itemMiddle = rect.top + rect.height / 2;
        
        if (mouseY < itemMiddle) {
            // Insert before target
            targetItem.parentNode.insertBefore(this.placeholder, targetItem);
        } else {
            // Insert after target
            targetItem.parentNode.insertBefore(this.placeholder, targetItem.nextSibling);
        }
    }
    
    moveElement() {
        if (!this.placeholder || !this.draggedElement) return;
        
        // Remove from original position
        this.draggedElement.remove();
        
        // Insert at new position
        if (this.placeholder.nextSibling) {
            this.placeholder.parentNode.insertBefore(this.draggedElement, this.placeholder);
        } else {
            this.placeholder.parentNode.appendChild(this.draggedElement);
        }
        
        // Update data-index attributes
        const items = this.element.querySelectorAll('.file-item');
        items.forEach((item, index) => {
            item.dataset.index = index;
        });
    }
    
    removePlaceholder() {
        if (this.placeholder && this.placeholder.parentNode) {
            this.placeholder.parentNode.removeChild(this.placeholder);
        }
        this.placeholder = null;
    }
    
    // Static method to match SortableJS API
    static create(element, options) {
        return new CustomSortable(element, options);
    }
}

// Export for use in other files
window.CustomSortable = CustomSortable;
