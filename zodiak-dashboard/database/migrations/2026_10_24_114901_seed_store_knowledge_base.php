<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Starting knowledge for the launch products, from traditional Vedic gem and rudraksha practice.
     * The Pandit team can change any of it in Op-Center → Products → Pandit Jii knowledge.
     *
     * @var array<string, array<string, mixed>>
     */
    private const KNOWLEDGE = [
        'ceylon-yellow-sapphire-ring' => [
            'planets' => ['Jupiter'],
            'best_for' => 'Growth in job or business, higher studies and teaching, wisdom and good decisions, delayed marriage, blessings for children, money and savings, faith and spiritual growth.',
            'suits_charts' => 'Jupiter is a friendly planet for Sagittarius, Pisces, Aries, Cancer, Scorpio and Leo rising. Good when Jupiter is weak, combust or in a difficult sign but rules good houses for the chart, and during a Jupiter mahadasha or antardasha.',
            'avoid_when' => 'Usually not for Taurus, Libra, Capricorn or Aquarius rising, where Jupiter rules difficult houses; Gemini and Virgo rising need a Pandit check first. Do not wear together with Blue Sapphire, Diamond or Emerald.',
            'how_to_use' => 'Set in gold, worn on the index finger of the working hand. Start on a Thursday morning in the bright half of the month, after washing it in raw milk and Ganga water and chanting "Om Brim Brihaspataye Namah" 108 times.',
            'notes' => 'A safe and popular choice for many charts, but a Pandit always checks the chart before it is made.',
        ],
        'five-mukhi-nepal-rudraksha-bracelet' => [
            'planets' => ['Jupiter'],
            'best_for' => 'A calm mind, stress and worry, focus in studies and work, daily prayer and meditation, a feeling of protection. A gentle first remedy for anyone.',
            'suits_charts' => 'Suits every chart, sign and age; there is no planet it can harm. Especially helpful when the person asks about stress, peace of mind or focus, or when Jupiter is weak.',
            'avoid_when' => 'No chart reason to avoid it. It supports health habits but never replaces a doctor.',
            'how_to_use' => 'Wear on the wrist touching the skin, first on a Monday morning after chanting "Om Hreem Namah" 108 times. Take it off for sleep and bathing if you like, and keep it clean and dry.',
            'notes' => 'Best suggestion when someone wants something simple and affordable, or is not sure about gemstones.',
        ],
        'zambian-emerald-panna-ring' => [
            'planets' => ['Mercury'],
            'best_for' => 'Studies and exams, memory, clear speech and writing, business and trade, accounts, IT and communication jobs, confidence in talking.',
            'suits_charts' => 'Mercury is friendly for Taurus, Gemini, Virgo, Libra, Capricorn and Aquarius rising. Good when Mercury is weak or combust, and during a Mercury mahadasha or antardasha.',
            'avoid_when' => 'Usually not for Aries, Cancer or Scorpio rising without a Pandit check. Do not wear together with Red Coral, Pearl or Yellow Sapphire.',
            'how_to_use' => 'Set in gold or silver, worn on the little finger of the working hand. Start on a Wednesday morning after chanting "Om Bum Budhaya Namah" 108 times.',
            'notes' => 'Good for students and business people when the chart supports Mercury.',
        ],
        'kashmir-blue-sapphire-neelam' => [
            'planets' => ['Saturn'],
            'best_for' => 'Steady career after delays, discipline and hard work paying off, Sade Sati and Saturn periods, property and long-term success.',
            'suits_charts' => 'Saturn is very friendly for Taurus and Libra rising, and good for Capricorn and Aquarius rising. Consider during a Saturn mahadasha or antardasha when Saturn rules good houses for the chart.',
            'avoid_when' => 'Usually not for Aries, Cancer, Leo or Scorpio rising. Never wear without a trial first. Do not wear together with Ruby, Red Coral, Pearl or Yellow Sapphire.',
            'how_to_use' => 'Do a 3-day trial first: keep it under the pillow or wear it, and stop if there is unease or bad dreams. Then wear in silver or platinum on the middle finger of the working hand, starting on a Saturday evening after chanting "Om Sham Shanaischaraya Namah" 108 times.',
            'notes' => 'The strongest and fastest-acting stone; only suggest when the chart clearly supports Saturn, and always say a trial comes first.',
        ],
        'italian-red-coral-moonga' => [
            'planets' => ['Mars'],
            'best_for' => 'Courage and energy, confidence, land and property, siblings, sports, police and army careers, and the traditional remedy for Mangal Dosha.',
            'suits_charts' => 'Mars is friendly for Aries, Scorpio, Cancer, Leo, Sagittarius and Pisces rising. Good when Mars is weak, during a Mars mahadasha or antardasha, and for Mangal Dosha when Mars is a friendly planet for the chart.',
            'avoid_when' => 'Usually not for Taurus, Gemini, Virgo, Libra or Aquarius rising without a Pandit check. Do not wear together with Emerald, Blue Sapphire or Diamond.',
            'how_to_use' => 'Set in copper or gold, worn on the ring finger of the working hand. Start on a Tuesday morning after chanting "Om Ang Angarakaya Namah" 108 times.',
            'notes' => 'For Mangal Dosha questions, explain gently that a Pandit checks the full chart and that matching both charts matters more than one stone.',
        ],
        'hardbound-kundli' => [
            'planets' => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'],
            'best_for' => 'Anyone who wants their full birth chart on paper: marriage meetings and matching, family records, a newborn\'s kundli, a gift for parents, or a detailed reading to keep.',
            'suits_charts' => 'Suits everyone. Especially useful when the person asks for a full or written reading, is planning marriage talks, or wants to show their chart to the family pandit.',
            'avoid_when' => 'No reason to avoid. It needs the exact birth date, time and place.',
            'how_to_use' => 'Made from the birth details in the app and printed with a hard cover. Keep it safe at home and take it to family functions or pandit visits.',
            'notes' => 'Not a planetary remedy; suggest it for record-keeping or marriage questions, not to fix a planet.',
        ],
    ];

    public function up(): void
    {
        $now = now();

        foreach (self::KNOWLEDGE as $slug => $knowledge) {
            $remedyId = DB::table('remedies')->where('slug', $slug)->value('id');

            if ($remedyId === null || DB::table('remedy_knowledge')->where('remedy_id', $remedyId)->exists()) {
                continue;
            }

            DB::table('remedy_knowledge')->insert([
                ...$knowledge,
                'planets' => json_encode($knowledge['planets']),
                'remedy_id' => $remedyId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * The team may have edited these entries since, so they are left in place.
     */
    public function down(): void
    {
        //
    }
};
