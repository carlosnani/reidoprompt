import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Upload, Save, Info, FileText, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitToastButton } from "@/components/admin/SubmitToastButton";

export default function NewPromptPage() {
  return (
    <div className="flex-1 space-y-8 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/prompts">
          <Button variant="ghost" size="icon" className="hover:bg-admin-muted rounded-full">
            <ArrowLeft className="w-5 h-5 text-admin-text-secondary" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-admin-text">New Prompt</h2>
          <p className="text-admin-text-secondary">Add a new prompt to the gallery</p>
        </div>
      </div>

      <form className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Basic Information</CardTitle>
                <CardDescription className="text-admin-text-muted">Details about the prompt that will be displayed in the gallery.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-admin-text">Title</label>
              <Input 
                id="title" 
                placeholder="Ex: Cinematic Sci-Fi Cityscape" 
                className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-admin-text">Category</label>
                <select 
                  id="category" 
                  className="flex h-10 w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 transition-all"
                >
                  <option value="">Select a category</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="portrait">Portrait</option>
                  <option value="cyberpunk">Cyberpunk</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-semibold text-admin-text">AI Model</label>
                <select 
                  id="model" 
                  className="flex h-10 w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 transition-all"
                >
                  <option value="">Select a model</option>
                  <option value="midjourney_v6">Midjourney v6</option>
                  <option value="dalle3">DALL-E 3</option>
                  <option value="stable_diffusion">Stable Diffusion XL</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-admin-text">Description (Optional)</label>
              <textarea 
                id="description" 
                rows={3}
                className="flex w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background placeholder:text-admin-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 transition-all"
                placeholder="Brief description of what this prompt achieves..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Prompt Content */}
        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Prompt Content</CardTitle>
                <CardDescription className="text-admin-text-muted">The actual prompt text that will be revealed to subscribers.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-admin-muted/30 border border-admin-border-light">
                <div className="space-y-0.5">
                  <label htmlFor="isPremium" className="text-sm font-semibold text-admin-text">Premium Content</label>
                  <p className="text-xs text-admin-text-muted">Make this prompt exclusive for Pro subscribers.</p>
                </div>
                <input 
                  type="checkbox" 
                  id="isPremium" 
                  className="w-5 h-5 rounded border-admin-border-strong text-admin-primary focus:ring-admin-primary transition-all cursor-pointer" 
                  defaultChecked 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="promptText" className="text-sm font-semibold text-admin-text">Prompt Text</label>
                <textarea 
                  id="promptText" 
                  rows={6}
                  className="flex w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background placeholder:text-admin-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 font-mono transition-all"
                  placeholder="/imagine prompt: highly detailed, cinematic lighting..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Prompt Images</CardTitle>
                <CardDescription className="text-admin-text-muted">Upload high-quality results generated by this prompt.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ImageUploader maxImages={6} />
          </CardContent>
        </Card>

        <div className="flex justify-end items-center gap-4 pt-4">
          <Link href="/admin/prompts">
            <Button variant="ghost" className="text-admin-text-secondary hover:bg-admin-muted">
              Cancel
            </Button>
          </Link>
          <SubmitToastButton message="Prompt criado com sucesso!" className="bg-admin-primary hover:bg-admin-primary-hover text-white h-12 px-8 rounded-xl shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Save Prompt
          </SubmitToastButton>
        </div>
      </form>
    </div>
  );
}
