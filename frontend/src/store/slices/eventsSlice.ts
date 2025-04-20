import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Event, EventsState } from '../../types/store';
import { eventService } from '../../api/eventService';

const initialState: EventsState = {
  items: [],
  userEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,
  filter: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents();
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to fetch events');
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'events/fetchUserEvents',
  async (userId: number) => {
    const allEvents = await eventService.getEvents();
    return allEvents.filter(event => event.createdBy === userId);
  }
);

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id: number) => {
  const response = await eventService.getEventById(id);
  return response;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id: number) => {
  await eventService.deleteEvent(id);
  return id;
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Event['category'] | null>) {
      state.filter = action.payload;
    },
    selectEvent(state, action: PayloadAction<number | null>) {
      state.selectedEvent = state.items.find(event => event.id === action.payload) || null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.userEvents = action.payload;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
      })
      .addCase(deleteEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(event => event.id !== action.payload);
        state.userEvents = state.userEvents.filter(event => event.id !== action.payload);
        if (state.selectedEvent?.id === action.payload) {
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка при удалении события';
      });
  },
});

export const { setFilter, selectEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
