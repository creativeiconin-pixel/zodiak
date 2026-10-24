<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Seeker;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SeekerController extends Controller
{
    /**
     * Payment states where the seeker's money is (or was) actually with us.
     */
    private const PAID = [PaymentStatus::EscrowHeld, PaymentStatus::Captured, PaymentStatus::RefundPending];

    /**
     * Every seeker who has signed up to the app, newest first, with a search box.
     */
    public function index(Request $request): View
    {
        $search = trim((string) $request->query('q', ''));

        $seekers = Seeker::query()
            ->when($search !== '', fn (Builder $query) => $query->where(fn (Builder $inner) => $inner
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', '%'.preg_replace('/\D/', '', $search).'%')))
            ->withCount(['orders', 'chatMessages as questions_count' => fn (Builder $query) => $query->where('role', 'user'), 'palmReadings'])
            ->withSum(['orders as paid_total' => fn (Builder $query) => $query->whereIn('payment_status', self::PAID)], 'amount')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('seekers.index', [
            'seekers' => $seekers,
            'search' => $search,
            'totals' => [
                'all' => Seeker::count(),
                'with_chart' => Seeker::whereNotNull('chart')->count(),
                'this_week' => Seeker::where('created_at', '>=', now()->subWeek())->count(),
            ],
        ]);
    }

    /**
     * One seeker's profile: birth details, credits, orders, recent questions to Pandit Jii, and palm readings.
     */
    public function show(Seeker $seeker): View
    {
        $seeker->loadCount(['orders', 'chatMessages as questions_count' => fn (Builder $query) => $query->where('role', 'user'), 'palmReadings']);

        return view('seekers.show', [
            'seeker' => $seeker,
            'orders' => $seeker->orders()->with('remedy')->latest()->get(),
            'questions' => $seeker->chatMessages()->where('role', 'user')->latest('id')->limit(15)->get(),
            'palmReadings' => $seeker->palmReadings()->latest()->limit(5)->get(),
            'paidTotal' => (int) $seeker->orders()->whereIn('payment_status', self::PAID)->sum('amount'),
            'creditHistory' => $seeker->creditTransactions()->with('creator:id,name')->latest('id')->limit(15)->get(),
        ]);
    }
}
