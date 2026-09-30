import React from 'react';
import { UserStats, CaughtRecord } from '../types';
import { FISH_SPECIES } from '../data/fishCatalog';
import { PixelFish } from './PixelFish';

interface FishJournalViewProps {
  stats: UserStats;
  journal: CaughtRecord[];
}

export const FishJournalView: React.FC<FishJournalViewProps> = ({
  stats,
  journal
}) => {
  return (
    <div className="space-y-2.5 max-w-lg mx-auto select-none">
      
      {/* Header Profile RPG Card */}
      <div className="gb-window p-2.5 flex items-center justify-between gap-2 rounded-lg">
        <div>
          <span className="font-pixel text-[8px] text-[#f8b800] tracking-wider uppercase block">
            ▶ ANGLER LOGBOOK
          </span>
          <h2 className="text-xs font-bold text-white font-pixel mt-0.5">
            FISH BESTIARY
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="p-1 px-2 rounded bg-[#0b1219] border border-[#2b3e54] text-center min-w-[60px]">
            <span className="text-[7px] font-pixel text-stone-400 block uppercase">CAUGHT</span>
            <span className="text-xs font-bold text-[#f8b800] font-pixel">{journal.length}</span>
          </div>

          <div className="p-1 px-2 rounded bg-[#0b1219] border border-[#2b3e54] text-center min-w-[60px]">
            <span className="text-[7px] font-pixel text-stone-400 block uppercase">SPECIES</span>
            <span className="text-xs font-bold text-[#78d8a0] font-pixel">
              {new Set(journal.map(j => j.fishSpeciesId)).size}/{FISH_SPECIES.length}
            </span>
          </div>
        </div>
      </div>

      {/* 8-Bit Fish Species Bestiary (Pokémon Pokédex Style) */}
      <div className="gb-window p-2.5 space-y-2 rounded-lg">
        <h3 className="font-pixel text-[9px] text-stone-300 uppercase tracking-wider">
          POND SPECIES ({FISH_SPECIES.length})
        </h3>

        <div className="grid grid-cols-2 gap-1.5">
          {FISH_SPECIES.map((fish) => {
            const count = journal.filter(j => j.fishSpeciesId === fish.id).length;
            const discovered = count > 0;

            return (
              <div
                key={fish.id}
                className="p-1.5 rounded border border-[#2b3e54] bg-[#0c141d] flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded bg-[#070b10] border border-[#233548] flex items-center justify-center shrink-0">
                  <PixelFish type={fish.type} size="sm" animated={discovered} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-[10px] font-pixel text-white leading-tight truncate">
                    {discovered ? fish.name : '???'}
                  </h4>
                  <p className="text-[8px] text-[#f8b800] font-pixel leading-tight truncate">
                    {fish.tag.toUpperCase()}
                  </p>
                  <p className="text-[8px] font-pixel text-stone-400 mt-0.5">
                    {count} LOGGED
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Catches Log */}
      <div className="gb-window p-2.5 space-y-1.5 rounded-lg">
        <h3 className="font-pixel text-[9px] text-stone-300 uppercase tracking-wider">
          RECENT ENTRIES
        </h3>

        {journal.length === 0 ? (
          <p className="text-[9px] font-pixel text-stone-500 py-2 text-center">
            NO CATCH RECORDS YET
          </p>
        ) : (
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {journal.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="p-1.5 rounded bg-[#0c141d] border border-[#233548] flex items-center justify-between text-[10px]"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-bold text-white truncate">{record.taskTitle}</p>
                  <span className="text-[8px] font-pixel text-[#78d8a0]">{record.fishName}</span>
                </div>
                <span className="text-[8px] font-pixel text-stone-400 shrink-0">
                  {new Date(record.caughtAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
