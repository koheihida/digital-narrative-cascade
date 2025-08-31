import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'

const HowToModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="
            w-full py-3 bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 
            text-white border border-slate-600/30 rounded-xl
            hover:from-slate-800/90 hover:via-slate-700/80 hover:to-slate-800/90 
            hover:border-slate-500/40 backdrop-blur-xl shadow-xl
            transition-all duration-300 font-light tracking-wide
          "
        >
          How To Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 text-white border-white/20 max-w-lg backdrop-blur-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-center">
            Digital Character Waterfall - How To Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-blue-300">基本操作</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-200 font-mono">•</span>
                  <span><strong>マウスクリック</strong>：画面上をクリックして岩を配置</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-200 font-mono">•</span>
                  <span><strong>岩をクリア</strong>：配置した全ての岩を削除</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-green-300">文字の仕組み</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>太宰治の小説から文字が一つずつ流れ落ちます</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>文字は重力に従い、岩に当たると反射します</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>文字が溜まりすぎると、自然に溢れて流れ去ります</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>古い文字は時間とともに薄くなり消えていきます</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-yellow-300">コントロール機能</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span><strong>テキストソース</strong>：太宰治、般若心経、カスタムURLから選択</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span><strong>スピード調整</strong>：文字の落下速度を5段階で細かく制御</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span><strong>岩の配置</strong>：クリックで岩を設置、文字の流れを制御</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span><strong>岩の表示</strong>：岩表示ボタンで配置した岩を可視化</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-purple-300">カスタムURL機能</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-purple-200 font-mono">•</span>
                  <span>任意のWebサイトのURLを入力</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-200 font-mono">•</span>
                  <span>自動的にテキストを抽出・整理</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-200 font-mono">•</span>
                  <span>ニュース、小説、ブログなど幅広く対応</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-200 font-mono">•</span>
                  <span>安全なエラーハンドリングで確実な取得</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-orange-300">楽しみ方のコツ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-200 font-mono">•</span>
                  <span>岩を斜めに配置すると文字が美しく反射します</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-200 font-mono">•</span>
                  <span>複数の岩で「文字の道」を作ってみましょう</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-200 font-mono">•</span>
                  <span>好きなWebページの文字で自分だけの滝を作成</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />
          
          <div className="text-center text-xs text-white/60">
            <p>画面をクリックして、あなただけの文字滝を作ってみてください</p>
          </div>
        </div>

        <div className="pt-4">
          <DialogClose asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              始める
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToModal