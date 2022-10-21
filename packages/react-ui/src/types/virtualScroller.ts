/**
 * Interface SCVirtualScrollerItem
 * Each rendered element in the virtual feed must implement this interface
 * and use these methods when necessary to avoid scroll position "jumping"
 * as the user scrolls and to
 */
export interface VirtualScrollerItemProps {
  /**
   * Save current state and when the component re-mount
   * restore previous state using props. It is used to keep a copy of
   * VirtualScroller state so that it could be quickly restored
   * in case the VirtualScroller component gets unmounted and then
   * re-mounted back again — for example, when the user navigates away
   * by clicking on a list item and then navigates "Back" to the list.
   * @param s
   */
  onStateChange?: (state) => void;

  /**
   * Must be called whenever a list item's height changes
   * (for example, when a user clicks an "Expand"/"Collapse" button of
   * a list item): it re-measures the item's height and updates VirtualScroller
   * layout. Every change in an item's height must come as a result of
   * changing some kind of a state, be it the item's state in VirtualScroller
   * via .onItemStateChange(), or some other state managed by the application.
   * Call this method to re-measure the current element.
   */
  onHeightChange?: () => void;
}
