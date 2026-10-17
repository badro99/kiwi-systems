"""Outline branch descriptors using the approved Commerce lockup and Inter Tight.
Usage: python build-lockups.py /path/to/kiwi-parent /path/to/InterTight-VariableFont_wght.ttf
Requires fonttools. The Kiwi mark paths, proportions and colours are unchanged.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import re,sys
parent=Path(sys.argv[1]);font=instantiateVariableFont(TTFont(sys.argv[2]),{'wght':600},inplace=False)
glyphs=font.getGlyphSet();cmap=font.getBestCmap();scale=165/font['head'].unitsPerEm
original=(parent/'KIWI-FINAL-Brand-Identity/kiwi-commerce/kiwi-commerce-horizontal-inverse.svg').read_text()
for branch in ['Systems','Commerce']:
 x=1183.73;paths=[]
 for ch in branch:
  name=cmap[ord(ch)];pen=SVGPathPen(glyphs);glyphs[name].draw(TransformPen(pen,(scale,0,0,-scale,x,663.7)))
  paths.append('<path d="'+pen.getCommands()+'" fill="#3f54ce"/>');x+=glyphs[name].width*scale-1
 source=re.sub(r'<defs>.*?</defs>','',original,flags=re.S)
 source=re.sub(r'<text.*?</text>','\n'.join(paths),source,flags=re.S)
 source=source.replace('Kiwi Commerce','Kiwi '+branch).replace('viewBox="183.73 209.36 1846.5 466.1"',f'viewBox="183.73 209.36 {x-183.73+20:.2f} 466.1"')
 source=source.replace('#f2f2f2','#000000').replace('#398063','#3955d6').replace('#aaf0c1','#3f54ce')
 source=source.replace('fill="#3955d6"','fill="#222f77"',1).replace('fill="#3f54ce"','fill="#3f54ce"',1)
 (Path(__file__).resolve().parent.parent/'assets'/('kiwi-'+branch.lower()+'.svg')).write_text(source)
print('Official Kiwi paths and Inter Tight descriptors outlined for Systems and Commerce.')
