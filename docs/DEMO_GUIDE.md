# Demo Video & Screenshot Checklist (`/docs`)

Use this checklist when recording the 2–3 minute demo video and saving screenshots in `/docs/` on a real Android device or emulator:

1. **Normal Day Theme (Light + Dark)**
   - Launch on Home tab showing the `hero_banner`, `quick_actions`, `category_chips`, `offer_strip`, `doctor_carousel`, and `service_grid` bands.
   - Scroll down to show the shrinking `CollapsibleHeader`, hero parallax, and section entrance animations.
   - Tap the Moon icon in the header to demonstrate config-driven Dark Mode.

2. **Festival Theme Switch (Zero Code Change)**
   - Tap the `Normal Day` pill in the header to switch to `Diwali Special` (`FESTIVAL_LAYOUT_CONFIG`).
   - Highlight that theme colors, Diwali greeting banner, section order (`offer_strip` and `service_grid` moved up), and items update immediately.
   - Switch language via the `EN / हिं / తె` pill to show Hindi & Telugu support.

3. **Booking Flow + Forced Failure + Offline Queue**
   - Tap `Book Slot` on a doctor or service card to open the gesture-driven `BookingBottomSheet`.
   - Select Day +3 to show the designed Empty State (`No slots available on this date`).
   - Go to **Profile** -> set Simulated Failure to `409 Slot Taken` -> return and confirm a slot to show optimistic rollback + conflict banner.
   - Reset failure to `Healthy`, toggle `Offline Mode` on, confirm a slot -> show `Saved to Offline Queue` celebration and `Queued Offline` badge in **Bookings**.
   - Toggle `Offline Mode` off -> show automatic sync to `Confirmed`.

4. **Prescriptions & Medicine Reminders**
   - Open **Prescriptions** tab -> tap `Set Daily Reminders` to schedule 8 AM / 2 PM / 9 PM alerts.
   - Open a prescription -> mark Morning/Afternoon/Night doses as taken and observe progress bar update.

5. **Live Admin Config Editor**
   - Open **Profile** -> `Open Live Config Editor` -> tap `Flip Section Order` or edit `theme.primary` JSON -> tap `Apply Config Live` -> show Home updated immediately.
