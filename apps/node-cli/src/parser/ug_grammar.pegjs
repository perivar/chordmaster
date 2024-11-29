ChordSheet
  = metadataLines:Metadata? lines:ChordSheetContents? {
      return {
        type: "chordSheet",
        lines: [
          ...metadataLines,
          ...lines,
        ]
      };
    }

ChordSheetContents
  = newLine:NewLine? items:ChordSheetItemWithNewLine* trailingItem:ChordSheetItem? {
    const hasEmptyLine = newLine?.length > 0;
    return [hasEmptyLine ? [{ type: "line", items: [] }] : [], ...items, trailingItem];
  }

ChordSheetItemWithNewLine
  = item:ChordSheetItem NewLine {
    return item;
  }

ChordSheetItem
  = item:(SectionLineWithBrackets / TabTag / ChordTagWithChars / ChordTagsLine / SectionLine / LyricsLine) {
    if (item.type === "chordsLine") {
      return {
        type: "line",
        items: item.items.map((item: any) => {
          const chordLyricsPair = {
            type: "chordLyricsPair"
          };
          if (item.type === "chord") {
            return {
              ...chordLyricsPair,
              chord: item
            };
          }
          return {
            ...chordLyricsPair,
            chords: item.value
          };
        })
      };
    }
    return item;    
  }

sTabTag = "[tab]"
eTabTag = "[/tab]"

TabTag
  = sTabTag 
  items:(!eTabTag @TabTagChildren)*
  eTabTag {
    const chordsLineItems = items.map((item: any) => {
        if (item.type === "chordsLine") {
        	const chordsLineArray = item.items.map((item: any) => {
          		const chordLyricsPair = {
            		type: "chordLyricsPair"
          		};
                if (item.type === "chord") {
                  return {
                    ...chordLyricsPair,
                    chord: item
                  };
                }
                return {
                  ...chordLyricsPair,
                  chords: item.value
                };
            })
            return chordsLineArray          
        } else if (item.type === "line") {
            return item.items
        }  else {
          if (item.type === "section") {
            return { type: "tag", name: "comment", value: item.value }
          }
          if (item.type === "guitar-tab-prefix") {
            return { type: "tag", name: "comment", value: item.value }
          }
          if (item.type === "guitar-tab-line") {
            return { type: "tag", name: "comment", value: item.value }
          }
          return { ...item }          
        }
    }).flat()
    
    return {
       type: "line",
       items: chordsLineItems
    }
  }

TabTagChildren
  = NewLine* @(ChordLyricsLines / ChordTagsLine / SectionWithBrackets / GuitarTabLinePrefix / GuitarTabLine) NewLine*
  
SectionWithBrackets
  = !Escape _ "[" _ value:$(MetadataKey) _ "]" _ {
      return { type: "section", value }
    }

GuitarTabStart = ("|e|"i / "e|"i)

GuitarTabLinePrefix
  = value:$(!GuitarTabStart [^\r\n])+ {	
	   return { type: "guitar-tab-prefix", value }
   }

GuitarTabLine
   = tabline: $( __ "|"? [EBGDA\-]i+ "|" [a-z0-9^\-\(\)| \t]i+ [\r\n]? ) {
      return { type: "guitar-tab-line", value: tabline.trim() }
    }

ChordLyricsLines
  = chordsLine:ChordTagsLine NewLine !GuitarTabStart lyrics:NonEmptyLyrics {
      const chords = chordsLine.items;
      const TABLEN = 5; // the length of [tab]
      const CHLEN = 9; // the length of [/ch] + [ch]

      const chordLyricsPairs = chords.map((chord: any, i: number) => {
        const nextChord = chords[i + 1];
        const start = chord.column - 1 +(-TABLEN -CHLEN*i);
        const end = nextChord ? nextChord.column - 1 +(-TABLEN -CHLEN*(i+1)): lyrics.length;
        const pairLyrics = lyrics.substring(start, end);
        const result = /(\s+)(\S+)/.exec(pairLyrics);
        const secondWordPosition = result ? (result.index + result[1].length) : null;

        const chordData = (chord.type === "chord") ? { chord } : { chords: chord.value };

        if (secondWordPosition && secondWordPosition < end) {
          return [
            { type: "chordLyricsPair", ...chordData, lyrics: pairLyrics.substring(0, secondWordPosition) },
            { type: "chordLyricsPair", chords: "", lyrics: pairLyrics.substring(secondWordPosition) },
          ];
        }

        return { type: "chordLyricsPair", ...chordData, lyrics: pairLyrics };
      }).flat();

      const firstChord = chords[0];

      if (firstChord && firstChord.column > 1) {
      	const firstChordPosition = firstChord.column -TABLEN;

        if (firstChordPosition > 1) {
          chordLyricsPairs.unshift({
            type: "chordLyricsPair",
            chords: "",
            lyrics: lyrics.substring(0, firstChordPosition - 1),
          });
        }
      }

      return { type: "line", items: chordLyricsPairs };
    }

ChordTagsLine
  = chords:(ChordTagWithSpacing)+ {
      return { type: "chordsLine", items: chords };
    }

ChordTagWithChars
  = _ chord:(ChordTagWithSpacing) _ !"[ch]" lyrics:(Lyrics) {

    const chordLyricsPair = {
    	type: "chordLyricsPair"
    };

  	if (lyrics.length === 0) {
      return {
      	type: "line",
        items: [
        	{
	    	  ...chordLyricsPair,
    		  chord
            }
        ]
   	  };
    }

    return {
      	type: "line",
        items: [
        	{
	    	    ...chordLyricsPair,
                chords: '',
                lyrics,
                chord,
            }
        ]
    };
  }
    
LyricsLine
  = lyrics:Lyrics {
  	if (lyrics.length === 0) {
      return { type: "line", items: [] };
    }

    return {
      type: "line",
      items: [
        { type: "chordLyricsPair", chords: "", lyrics }
      ]
    };
  }

Lyrics
  = $(WordChar*)

NonEmptyLyrics
  = $(!"e|"i WordCharNonBracket+)

ChordTag
  = "[ch]" chord:(ChordSymbol) "[/ch]" {
      return { type: "chord", ...chord, column: location().start.column};
    }

ChordTagSpacer
   = _ [|?]* _

ChordTagWithSpacing
  = ChordTagSpacer chord:ChordTag ChordTagSpacer {
      return chord;
    }
      
ChordSymbol
  = root:ChordSymbolRoot modifier:ChordModifier? suffix:$(ChordSuffix) bass:ChordSymbolBass? {
  	  return { base: root, modifier, suffix, ...bass, chordType: "symbol" };
    }

ChordModifier = [#♯b♭]
ChordSuffix = [a-zA-Z0-9()#\+]*
ChordSymbolRoot = [A-Ha-h]
ChordSymbolBass
  = "/" root:ChordSymbolRoot modifier:ChordModifier? {
      return { bassBase: root, bassModifier: modifier };
    }

Metadata
  = __ pairs:MetadataPairWithNewLine* trailingPair:MetadataPair? MetadataSeparator? {
      return [...pairs, trailingPair]
        .filter(x => x)
        .map(([key, value]) => ({
          type: "line",
          items: [
            { type: "tag", name: key, value },
          ],
        }));
    }

InlineMetadata
  = key:$(MetadataKey) _ Colon _ value:$(MetadataValue) {
      return {
        type: "line",
        items: [
          { type: "tag", name: key, value },
        ],
      }
    }

MetadataPairWithNewLine
  = pair:MetadataPair NewLine {
      return pair;
    }

MetadataPair
  = MetadataPairWithBrackets / MetadataPairWithoutBrackets

MetadataPairWithBrackets
  = !Escape "{" _ pair:MetadataPairWithoutBrackets _ "}" {
    return pair;
  }

MetadataPairWithoutBrackets
  = key:$(MetadataKey) _ Colon _ value:$(MetadataValue) {
    return [key, value];
  }

SectionLine
  = line:$(MetadataKey) _ Colon _ !(WordChar) {
      return {
        type: "line",
        items: [
          { type: "tag", name: "comment", value: line }
        ]
      };
    }
  
SectionLineWithBrackets
  = !Escape _ "[" _ !"tab" !"ch" line:$(MetadataKey) _ "]" _ text:(Lyrics) {
  
    if (text) {
      return {
        type: "line",
        items: [
          { type: "tag", name: "comment", value: line },
          { type: "tag", name: "comment", value: text } 
        ]
      }
     }
     
     return {
        type: "line",
        items: [
          { type: "tag", name: "comment", value: line },
        ]
      }
    }
    
Escape
  = "\\"
  
Colon
  = ":"

MetadataKey
  = [a-zA-Z0-9-_ \t]+

MetadataValue
  = [^\n\r}]+

WordChar
  = [^\n\r]

WordCharNonBracket
  = [^\]\[\n\r]

Text
  = chars:[^\[]+  { 
    return { 
    	type: 'text', 
        value: chars.join("") 
    } 
}

MetadataSeparator
  = "---" NewLine

Space "space"
  = [ \t]

_ // Insignificant space
  = Space*

__ // Insignificant whitespace
  = (Space / NewLine)*

NewLine
  = CarriageReturn / LineFeed / CarriageReturnLineFeed

CarriageReturnLineFeed
  = CarriageReturn LineFeed

LineFeed
  = "\n"

CarriageReturn
  = "\r"
  
EOL "end of line" // Strict linebreak or end of file
  = _ (NewLine / EOF)

EOF "end of file"
  = !.
