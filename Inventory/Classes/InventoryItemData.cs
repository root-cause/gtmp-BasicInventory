using Inventory.Interfaces;

namespace Inventory.Classes
{
    public class InventoryItemData
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int StackSize { get; private set; }
        public int Quantity { get; private set; }
        public bool IsDroppable { get; private set; }

        public InventoryItemData(InventoryItem item)
        {
            Name = item.Item.Name;
            Description = item.Item.Description;
            StackSize = item.Item.StackSize;
            Quantity = item.Quantity;
            IsDroppable = (item.Item is IDroppable);
        }
    }
}
